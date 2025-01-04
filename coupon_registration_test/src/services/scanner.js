const db = require('../db');
const tesseract = require('tesseract.js');
const sharp = require('sharp');
const {
    MultiFormatReader,
    DecodeHintType,
    RGBLuminanceSource,
    BinaryBitmap,
    HybridBinarizer,
} = require('@zxing/library');

async function extractBarcodeAndText(imageBuffer) {
    try {
        // 이미지 메타 데이터
        const { width, height } = await sharp(imageBuffer).metadata();
        // 이미지 전처리
        const preprocessedBuffer = await sharp(imageBuffer)
            .greyscale()
            .threshold(128)
            .raw()
            .toBuffer();

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

        // OCR을 사용하여 이미지에서 텍스트를 추출
        const ocrResult = await tesseract.recognize(imageBuffer, 'eng+kor', {
            // Tesseract로 이미지에서 텍스트 추출 (영어와 한국어)
            tessedit_pageseg_mode: '6', // 페이지 분할 모드 설정: 텍스트 블록을 하나로 처리 (모든 텍스트를 한 번에 인식)
        });
        console.log('추출된 텍스트:', ocrResult.data.text.trim()); // OCR로 추출된 텍스트 출력 (앞뒤 공백 제거 후 출력)

        const couponType = classifyCoupon(ocrResult.data.text);

        if(couponType === 'kakao') {
            const productName = extractProductName(ocrResult.data.text);
            const expiryDate = extractExpiryDate(ocrResult.data.text);
            const storeName = extractStoreName(ocrResult.data.text);
            const orderNumber = extractOrderNumber(ocrResult.data.text);
            //결과 객체 배열
            const couponInfo = {
                barcode: barcodeText,
                type: couponType,
                productName: productName,
                expiryDate: expiryDate,
                storeName: storeName,
                orderNumber: orderNumber
            };
            console.log("쿠폰 정보",couponInfo);
            return couponInfo;
        } else if(couponType === 'gifticon') {
        }
    } catch (error) {
        console.error('오류 발생', error.message);
    }
}

// 쿠폰 종류 나누는 함수
const classifyCoupon = (text) => {
    if (text.includes('kakao')) {
        return 'kakao';
    } else if (text.includes('gifticon')) {
        return 'gifticon';
    } else {
        return '알 수 없음';
    }
}
// 쿠폰 상품명 추출 함수
const extractProductName = (text) => {
    // 상품명은 보통 여러 줄 중에서 가장 긴 한글 텍스트
    const lines = text.split('\n');
    let productName = '';
    let maxLength = 0;
    
    for (const line of lines) {
        const trimmedLine = line.trim();
        // 한글이 포함된 라인 중에서 가장 긴 것을 상품명으로 간주
        if (trimmedLine.match(/[가-힣]/) && trimmedLine.length > maxLength) {
            // "교환처", "유효기간" 등의 키워드가 포함되지 않은 라인만 선택
            if (!trimmedLine.includes('교 환 처') && 
            !trimmedLine.includes('유 효 기간') && 
            !trimmedLine.includes('선 물 하기') && 
            !trimmedLine.includes('주 문 번호')) {
                productName = trimmedLine;
                maxLength = trimmedLine.length;
            }
        }
    }
    return productName;
};

// 유효기간 추출 함수
const extractExpiryDate = (text) => {
    const expiryMatch = text.match(/유 효\s*기간\s*(20\d{2})\s*년\s*(\d{2})\s*월\s*(\d{2})\s*일/);
    if (expiryMatch) {
        return `${expiryMatch[1]}-${expiryMatch[2]}-${expiryMatch[3]}`;
    }
    return null;
};

// 교환처(매장명) 추출 함수
const extractStoreName = (text) => {
    const storeMatch = text.match(/교 환 처\s*([가-힣]+)/);
    return storeMatch ? storeMatch[1] : null;
};

// 주문번호 추출 함수
const extractOrderNumber = (text) => {
    const orderMatch = text.match(/주 문 번호\s*(\d+)/);
    return orderMatch ? orderMatch[1] : null;
};



module.exports = { extractBarcodeAndText };
