// const { createWorker } = require("tesseract.js");

// async function preprocessAndDetectBarcode(url) {
//   const worker = await createWorker(["eng", "kor"]);

//   (async () => {
//     const {
//       data: { text },
//     } = await worker.recognize(url);
//     console.log(text);
//     await worker.terminate();
//   })();
// }
// preprocessAndDetectBarcode("./images/test7.png");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");

async function barcodeNumberOCR(imagePath) {
  try {
    // 이미지 전처리 강화
    const preprocessedImage = await sharp(imagePath)
      // 이미지 크기 조정 (선명도 향상)
      .resize(1000, null, {
        fit: "contain",
        withoutEnlargement: true,
      })
      // 회색조 변환
      .grayscale()
      // 대비 크게 증가
      .linear(3, -0.3) // 기울기(contrast)를 2.5로 증가, 밝기 조정
      // 노이즈 제거
      .median(1)
      // 강한 이진화 처리
      .threshold(241) // 임계값을 높여서 흐린 텍스트도 감지
      .toBuffer();

    // Tesseract OCR 설정 최적화
    const result = await Tesseract.recognize(
      preprocessedImage,
      "eng+kor", // 숫자만 인식할 것이므로 영어 모드로 충분
      {
        // tessedit_char_whitelist: "0123456789-", // 바코드 숫자와 하이픈만 인식
        tessedit_pageseg_mode: "6", // PSM 6: Uniform block of text
        // 이미지 전처리 설정
        preserve_interword_spaces: "1",
        textord_heavy_nr: "1",
        textord_min_linesize: "1",
      }
    );

    return result.data.text.trim();
  } catch (error) {
    console.error("바코드 OCR 처리 중 오류 발생:", error);
    throw error;
  }
}

// 사용 예시
async function main() {
  try {
    const text = await barcodeNumberOCR("./images/test7.png");
    console.log("인식된 바코드 번호:", text);
  } catch (error) {
    console.error("실행 중 오류 발생:", error);
  }
}

main();
