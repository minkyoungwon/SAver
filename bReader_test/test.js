const sharp = require("sharp");
const path = require("path");
const {
  MultiFormatReader,
  DecodeHintType,
  RGBLuminanceSource,
  BinaryBitmap,
  HybridBinarizer,
} = require("@zxing/library");

async function preprocessAndDetectBarcode(imagePath) {
  try {
    // 이미지 대비와 그레이스케일 전처리
    const preprocessedBuffer = await sharp(imagePath)
      .greyscale() // 흑백 변환
      .threshold(128) // 이진화 처리
      .raw()
      .toBuffer();

    const { width, height } = await sharp(imagePath).metadata();

    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, null); // 모든 바코드 형식 허용

    const reader = new MultiFormatReader();
    reader.setHints(hints);

    const luminanceSource = new RGBLuminanceSource(
      preprocessedBuffer,
      width,
      height
    );
    const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));

    const result = reader.decode(binaryBitmap);
    console.log("결과 전부", result);
    // console.log("바코드 감지됨:", result.getText());
  } catch (error) {
    console.error("바코드 감지 실패:", error.message);
  }
}

const url = path.join(__dirname, "images", "test2.jpg");
preprocessAndDetectBarcode(url);
