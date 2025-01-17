const tesseract = require('tesseract.js');
const sharp = require('sharp');
const cv = require('opencv4nodejs');

const {
    MultiFormatReader,
    DecodeHintType,
    RGBLuminanceSource,
    BinaryBitmap,
    HybridBinarizer,
} = require('@zxing/library');

// 바코드 번호 추출 함수
async function extractBarcode(imageBuffer) {
    try {
        // 이미지 메타 데이터
        const { width, height } = await sharp(imageBuffer).metadata();
        // 이미지 전처리
        const preprocessedBuffer = await sharp(imageBuffer)
            .greyscale() // 이미지 흑백 처리
            .threshold(128) // 이미지 픽셀 검정 또는 흰색으로 이진화 처리
            .raw() // 압축되지 않은 원시 데이터로 변환
            .toBuffer(); // 최종적으로 이미지 버퍼 형태로 바꿔줘

        // 바코드 인식에 사용할 설정을 준비
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, null);
        const reader = new MultiFormatReader();
        reader.setHints(hints);

        // 전처리된 이미지를 바코드 인식을 위한 형식으로 전환환
        const luminanceSource = new RGBLuminanceSource(preprocessedBuffer, width, height);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        // 바코드에서 추출된 번호
        const barcodeText = reader.decode(binaryBitmap).getText();
        console.log('바코드 번호:', barcodeText);
        return barcodeText;
    } catch (error) {
        console.error('오류 발생', error.message);
    }
}

// 쿠폰 텍스트 정보 추출 함수
async function extractText(imageBuffer) {
    try {
        // 1. 그래픽이 ocr 되지 않도록 마스크 사용해서 필터링
        // 1-2. 이미지 버퍼에서 이미지 디코딩
        const decodedImage = cv.imdecode(imageBuffer);
        // 1-1. HSV 색상 공간으로 변환
        const hsvImage = decodedImage.cvtColor(cv.COLOR_BGR2HSV);

        // 1-2. 검정색과 회색 범위 설정 (0~180,0~255,0~255)
        const lowerBlack = new cv.Vec(0, 0, 0); // HSV에서 검정색 하한
        const upperBlack = new cv.Vec(0, 0, 50); // HSV에서 검정색 상한

        const lowerGray = new cv.Vec(0, 0, 60); // HSV에서 회색 하한
        const upperGray = new cv.Vec(0, 0, 204); // HSV에서 회색 상한

        // 1-3. 마스크 생성
        const blackMask = hsvImage.inRange(lowerBlack, upperBlack); // 검정색 영역
        const grayMask = hsvImage.inRange(lowerGray, upperGray); // 회색 영역

        // 2. 마스크 적용한 이미지에서 텍스트 추출
        // 2.1 쿠폰 종류, 상품명 추출 (blackMask)
        let ocrText = await getTextFromMask(blackMask);
        // 쿠폰 종류
        const couponType = classifyCoupon(ocrText);
        // 상품명 (보통 한줄이지만 두줄이상일 수도 있음)
        const ocrTextArray = removeEmptyLinesAsArray(ocrText);
        ocrTextArray.forEach((element, index) => {
            ocrTextArray[index] = removeAllSpaces(element);
        });

        let barcodeIndex = ocrTextArray.findIndex(
            // 바코드 번호가 있는 익덱스 찾기 (숫자8개 이상)
            (element) => typeof element === 'string' && /^\d{8,}$/.test(element)
        );

        let productName;
        if (barcodeIndex <= 1) {
            // 상품명 한 줄일 가능성 높음
            barcodeIndex = 1;
            productName = ocrTextArray[0];
        } else {
            // 상품명 두 줄일 가능성 높음
            const filteredArray = ocrTextArray
                .slice(0, barcodeIndex - 1)
                .filter((element) => element.length >= 12); // 문자열 길이 12개 미만 인 텍스트들 제거
            if (filteredArray.length === 0) {
                productName = ocrTextArray[barcodeIndex - 1];
            } else {
                productName = filteredArray.join('\n') + '\n' + ocrTextArray[barcodeIndex - 1];
            }
        }

        // 2.2 매장명, 유효기간 추출 (grayMask)
        ocrText = await getTextFromMask(grayMask);
        // 매장명
        let regex = /\s*교\s*환\s*처\s*/;
        let lineText = ocrText.split('\n').find((str) => regex.test(str));
        const storName = removeAllSpaces(lineText.replace(/\s*교\s*환\s*처\s*/g, ''));
        // 유효기간
        regex = /\s*유\s*효\s*기\s*간\s*/;
        lineText = ocrText.split('\n').find((str) => regex.test(str));
        const expirationDate = formateDateToISO(lineText.replace(/\s*유\s*효\s*기\s*간\s*/g, ''));

        const couponInfo = {
            type: couponType,
            productName: productName,
            expirationDate: expirationDate,
            storName: storName,
        };
        return couponInfo;
    } catch (error) {
        console.error('오류 발생', error.message);
    }
}

// 마스크가 적용된 이미지에서 OCR한 결과를 반환하는 함수
async function getTextFromMask(mask) {
    try {
        const maskBuffer = cv.imencode('.png', mask);

        const worker = await tesseract.createWorker(['eng', 'kor']);
        await worker.setParameters({
            tessedit_pageseg_mode: tesseract.PSM_AUTO_OSD,
        });
        const {
            data: { text },
        } = await worker.recognize(maskBuffer);
        await worker.terminate(); //worker 종료

        return text;
    } catch {
        console.error('오류 발생', error.message);
    }
}
// 쿠폰 종류 나누는 함수
function classifyCoupon(text) {
    if (text.includes('kakao')) {
        return 'kakao';
    } else if (text.includes('gifticon')) {
        return 'gifticon';
    } else {
        return '';
    }
}

// OCR 결과 텍스트에서 공백이 있는 줄 제거 후 배열로 return
function removeEmptyLinesAsArray(text) {
    return text.split('\n').filter((line) => line.trim() != '');
}

// OCR 결과 텍스트에서 모든 공백을 제거하는 함수 추가
function removeAllSpaces(text) {
    return text.replace(/\s+/g, '');
}

// 날짜를 ISO 형식(yyyy-mm--dd)로 포맷팅
function formateDateToISO(date) {
    const noSpaceDate = removeAllSpaces(date);
    let dateArray;
    // yyyy년mm월dd일 형식일 때,
    if (noSpaceDate.includes('년')) {
        dateArray = noSpaceDate.match(/^(\d{4})년(\d{2})월(\d{2})일$/);
        // yyyy.mm.dd 형식 일 때,
    } else if (noSpaceDate.includes('.')) {
        dateArray = noSpaceDate.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
    }

    if (dateArray) {
        return `${dateArray[1]}-${dateArray[2]}-${dateArray[3]}`;
    }
    throw new Error('유효하지 않은 날짜 형식입니다');
}

const fs = require('fs');
const imagePath = './images/kakao/img5.jpg';
const imageBufferSample = fs.readFileSync(imagePath);
extractText(imageBufferSample)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error('출력 에러');
    });

module.exports = { extractBarcode, extractText };
