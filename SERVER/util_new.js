// 이 코드들은 보류 
const tesseract = require('tesseract.js');
const sharp = require('sharp');
//const cv = require('opencv4nodejs');

const {
    MultiFormatReader,
    DecodeHintType,
    RGBLuminanceSource,
    BinaryBitmap,
    HybridBinarizer,
} = require('@zxing/library');

// 📌 바코드 번호 추출 함수
async function extractBarcode(imageBuffer) {
    try {
        const { width, height } = await sharp(imageBuffer).metadata();
        const preprocessedBuffer = await sharp(imageBuffer)
            .greyscale()
            .threshold(128)
            .raw()
            .toBuffer();

        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, null);
        const reader = new MultiFormatReader();
        reader.setHints(hints);

        const luminanceSource = new RGBLuminanceSource(preprocessedBuffer, width, height);
        const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

        const barcodeText = reader.decode(binaryBitmap).getText();
        console.log('✅ 바코드 번호:', barcodeText);
        return barcodeText;
    } catch (error) {
        console.error('❌ 바코드 추출 실패:', error.message);
        return null;
    }
}

// 📌 쿠폰 텍스트 정보 추출 함수
async function extractText(imageBuffer) {
    try {
        const decodedImage = cv.imdecode(imageBuffer);
        const hsvImage = decodedImage.cvtColor(cv.COLOR_BGR2HSV);

        const lowerBlack = new cv.Vec(0, 0, 0);
        const upperBlack = new cv.Vec(0, 0, 50);
        const lowerGray = new cv.Vec(0, 0, 60);
        const upperGray = new cv.Vec(0, 0, 204);

        const blackMask = hsvImage.inRange(lowerBlack, upperBlack);
        const grayMask = hsvImage.inRange(lowerGray, upperGray);

        const ocrTextBlack = await getTextFromMask(blackMask);
        const couponType = classifyCoupon(ocrTextBlack);
        const ocrTextArray = removeEmptyLinesAsArray(ocrTextBlack).map(removeAllSpaces);

        let barcodeIndex = ocrTextArray.findIndex((element) => typeof element === 'string' && /^\d{8,}$/.test(element));
        let productName = barcodeIndex <= 1 ? ocrTextArray[0] : extractProductName(ocrTextArray, barcodeIndex);

        const ocrTextGray = await getTextFromMask(grayMask);
        const storeName = extractStoreName(ocrTextGray);
        const expirationDate = extractExpirationDate(ocrTextGray);

        return { type: couponType, name: productName, deadline: expirationDate, usage_location: storeName };
    } catch (error) {
        console.error('❌ 텍스트 추출 실패:', error.message);
        return {};
    }
}

// 📌 OCR 적용 후 텍스트 변환
async function getTextFromMask(mask) {
    try {
        const maskBuffer = cv.imencode('.png', mask);
        const worker = await tesseract.createWorker(['eng', 'kor']);

        await worker.setParameters({ tessedit_pageseg_mode: tesseract.PSM_AUTO_OSD });
        const { data: { text } } = await worker.recognize(maskBuffer);
        await worker.terminate();

        return text;
    } catch (error) {
        console.error('❌ OCR 처리 실패:', error.message);
        return '';
    }
}

// 📌 상품명 추출 로직
function extractProductName(ocrTextArray, barcodeIndex) {
    const filteredArray = ocrTextArray.slice(0, barcodeIndex - 1).filter((element) => element.length >= 12);
    return filteredArray.length === 0 ? ocrTextArray[barcodeIndex - 1] : filteredArray.join('\n') + '\n' + ocrTextArray[barcodeIndex - 1];
}

// 📌 교환처(매장명) 추출
function extractStoreName(text) {
    const regex = /\s*교\s*환\s*처\s*/;
    const lineText = text.split('\n').find((str) => regex.test(str));
    return lineText ? removeAllSpaces(lineText.replace(regex, '')) : '';
}

// 📌 유효기간(날짜) 추출
function extractExpirationDate(text) {
    const regex = /\s*유\s*효\s*기\s*간\s*/;
    const lineText = text.split('\n').find((str) => regex.test(str));
    return lineText ? formatDateToISO(lineText.replace(regex, '')) : null;
}

// 📌 쿠폰 종류 분류
function classifyCoupon(text) {
    if (text.includes('kakao')) return 'kakao';
    if (text.includes('gifticon')) return 'gifticon';
    return '';
}

// 📌 OCR 결과에서 공백 줄 제거 후 배열 반환
function removeEmptyLinesAsArray(text) {
    return text.split('\n').filter((line) => line.trim() !== '');
}

// 📌 모든 공백 제거
function removeAllSpaces(text) {
    return text.replace(/\s+/g, '');
}

// 📌 날짜를 ISO 형식(yyyy-mm-dd)으로 포맷팅
function formatDateToISO(date) {
    const noSpaceDate = removeAllSpaces(date);
    let dateArray = noSpaceDate.match(/^(\d{4})년(\d{2})월(\d{2})일$/) || noSpaceDate.match(/^(\d{4})\.(\d{2})\.(\d{2})$/);
    return dateArray ? `${dateArray[1]}-${dateArray[2]}-${dateArray[3]}` : null;
}

// 📌 바코드 & 텍스트 OCR 결합
async function combineCouponData(imageBuffer) {
    try {
        const barcode = await extractBarcode(imageBuffer);
        const textData = await extractText(imageBuffer);

        return { barcode, image: imageBuffer, ...textData };
    } catch (error) {
        console.error('❌ 쿠폰 데이터 처리 중 오류:', error.message);
        return null;
    }
}

module.exports = { combineCouponData };
