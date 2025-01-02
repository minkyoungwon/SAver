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

// 테스트하기 위해서(지워라)
// const fs = require('fs');
// const imagePath = './images/img2.png';
// const imageBufferSample = fs.readFileSync(imagePath);

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
        // const ocrResult = await tesseract.recognize(imageBuffer, 'eng+kor', {
        //     // Tesseract로 이미지에서 텍스트 추출 (영어와 한국어)
        //     tessedit_pageseg_mode: '6', // 페이지 분할 모드 설정: 텍스트 블록을 하나로 처리 (모든 텍스트를 한 번에 인식)
        // });
        // console.log('추출된 텍스트:', ocrResult.data.text.trim()); // OCR로 추출된 텍스트 출력 (앞뒤 공백 제거 후 출력)

        //결과 객체 배열
        const scanResult = [{ barcode: barcodeText }];

        return scanResult;
    } catch (error) {
        console.error('오류 발생', error.message);
    }
}

// extractBarcodeAndText(imageBufferSample);

// const handleBarcodeProcessing = (barcodeId) => {
//     return new Promise((resolve, reject) => {
//         const query = 'SELECT * FROM barcodes WHERE id = ?';
//         db.execute(query, [barcodeId], (err, results) => {
//             if (err) {
//                 return reject('데이터베이스 쿼리 실패');
//             }
//             resolve(results);
//         });
//     });
// };

module.exports = { extractBarcodeAndText };
