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

        const filteredImage = await sharp(imageBuffer) // 이미지 크기 조정 (선명도 향상)
            .resize(1000, null, {
                fit: 'contain',
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

        async function barcodeNumberOCR(imagePath) {
            try {
                // 이미지 전처리 강화
                const preprocessedImage = await sharp(imagePath)
                    // 이미지 크기 조정 (선명도 향상)
                    .resize(1000, null, {
                        fit: 'contain',
                        withoutEnlargement: true,
                    })
                    // 회색조 변환
                    .grayscale()
                    // 대비 크게 증가
                    .linear(2.5, -0.3) // 기울기(contrast)를 2.5로 증가, 밝기 조정
                    // 노이즈 제거
                    .median(1)
                    // 강한 이진화 처리
                    .threshold(200) // 임계값을 높여서 흐린 텍스트도 감지
                    .toBuffer();

                // Tesseract OCR 설정 최적화
                const result = await Tesseract.recognize(
                    preprocessedImage,
                    'eng+kor', // 숫자만 인식할 것이므로 영어 모드로 충분
                    {
                        // tessedit_char_whitelist: "0123456789-", // 바코드 숫자와 하이픈만 인식
                        tessedit_pageseg_mode: '6', // PSM 6: Uniform block of text
                        // 이미지 전처리 설정
                        preserve_interword_spaces: '1',
                        textord_heavy_nr: '1',
                        textord_min_linesize: '1',
                    }
                );

                return result.data.text.trim();
            } catch (error) {
                console.error('바코드 OCR 처리 중 오류 발생:', error);
                throw error;
            }
        }
        // OCR을 사용하여 이미지에서 텍스트를 추출
        const ocrResult = await tesseract.recognize(imageBuffer, 'eng+kor', {
            // Tesseract로 이미지에서 텍스트 추출 (영어와 한국어)
            tessedit_pageseg_mode: '6', // 페이지 분할 모드 설정: 텍스트 블록을 하나로 처리 (모든 텍스트를 한 번에 인식)
        });
        console.log('추출된 텍스트:', ocrResult.data.text.trim()); // OCR로 추출된 텍스트 출력 (앞뒤 공백 제거 후 출력)

        const couponType = classifyCoupon(ocrResult.data.text);

        if (couponType === 'kakao') {
            const productName = extractProductName(ocrResult.data.text);
            const expirationDate = extractexpirationDate(ocrResult.data.text);
            const storeName = extractStoreName(ocrResult.data.text);
            //결과 객체 배열
            const couponInfo = {
                barcode: barcodeText,
                type: couponType,
                productName: productName,
                expirationDate: expirationDate,
                storeName: storeName,
            };
            return couponInfo;
        } else if (couponType === 'gifticon') {
        }
    } catch (error) {
        console.error('오류 발생', error.message);
    }
}

// 쿠폰 종류 나누는 함수
const classifyCoupon = (text) => {
    if (text.includes('talk') || text.includes('kakao')) {
        return 'kakao';
    } else if (text.includes('gifticon')) {
        return 'gifticon';
    } else {
        return '알 수 없음';
    }
};
// 쿠폰 상품명 추출 함수
const extractProductName = (text) => {
    const lines = text.split('\n');
    
    // 각 라인에 대해 점수 계산
    const scoredProducts = lines
        .map(line => ({
            text: removeAllSpaces(line),
            score: calculateProductScore(removeAllSpaces(line))
        }))
        .filter(item => item.score > 0); // 0점 이하는 제외
    
    // 점수순으로 정렬하고 가장 높은 점수의 상품명 반환
    const bestMatches = scoredProducts.sort((a, b) => b.score - a.score);
    
    // 디버깅을 위한 로그 (필요시 주석 해제)
    console.log('상품명 후보:', bestMatches.slice(0, 3));
    
    return bestMatches.length > 0 ? bestMatches[0].text : '';
};

// 상품명 점수 계산 함수
const calculateProductScore = (text) => {
    let score = 0;
    
    // 1. 길이 기반 점수 (4-20자 사이가 적당)
    if (text.length >= 4 && text.length <= 20) {
        score += 3;
    } else if (text.length > 20) {
        score -= (text.length - 20) * 0.5; // 길이가 길수록 감점
    }
    
    // 2. 일반적인 카페/식품 관련 키워드 점수
    const productKeywords = {
        high: ['라떼', '아메리카노', '케이크', '음료', '티', '주스', '프라푸치노', '블렌디드', '콤보', '콜라', '감자'],  // 가중치 높은 키워드
        medium: ['초코', '딸기', '바닐라', '카라멜', '에이드', '스무디', '샌드위치',], // 중간 가중치
        low: ['핫', '아이스', '콜드', '따뜻한', '차가운', '큰', '작은'] // 낮은 가중치
    };
    
    for (const keyword of productKeywords.high) {
        if (text.includes(keyword)) score += 4;
    }
    for (const keyword of productKeywords.medium) {
        if (text.includes(keyword)) score += 2;
    }
    for (const keyword of productKeywords.low) {
        if (text.includes(keyword)) score += 1;
    }
    
    // 3. 브랜드명 포함 시 추가 점수
    const brandKeywords = ['스타벅스', '투썸플레이스', '이디야', '할리스', '탐앤탐스'];
    for (const brand of brandKeywords) {
        if (text.includes(brand)) score += 2;
    }
    
    // 4. 불필요한 정보 감점
    const negativeKeywords = {
        high: ['교환처', '유효기간', '선물하기', '주문번호', '결제금액', '바코드'], // 큰 감점
        medium: ['매장', '지점', '번호', '날짜', '시간', '발행'], // 중간 감점
        low: ['적립', '포인트', '신청', '예약'] // 작은 감점
    };
    
    for (const keyword of negativeKeywords.high) {
        if (text.includes(keyword)) score -= 5;
    }
    for (const keyword of negativeKeywords.medium) {
        if (text.includes(keyword)) score -= 3;
    }
    for (const keyword of negativeKeywords.low) {
        if (text.includes(keyword)) score -= 1;
    }
    
    // 5. 텍스트 품질 점수
    if (!text.match(/\d/)) score += 2; // 숫자가 없으면 추가 점수
    if (!text.match(/[!@#$%^&*(),.?":{}|<>]/)) score += 2; // 특수문자가 없으면 추가 점수
    if (text.match(/^[가-힣\s]+$/)) score += 3; // 한글과 공백만 있으면 추가 점수
    
    // 6. 문자열 패턴 점수
    if (text.match(/^[가-힣]+\s[가-힣]+$/)) score += 2; // 두 단어로 구성된 경우 (예: "아메리카노 라떼")
    if (text.match(/[가-힣]+\([가-힣]+\)/)) score += 1; // 괄호를 포함한 상품명 (예: "아메리카노(핫)")
    
    return score;
};

// OCR 결과 텍스트에서 모든 공백을 제거하는 함수 추가
const removeAllSpaces = (text) => {
    return text.replace(/\s+/g, '');
};

// 유효기간 추출 함수 수정
const extractexpirationDate = (text) => {
    const noSpaceText = removeAllSpaces(text);
    if (noSpaceText.includes('년')) {
        const expiryMatch = noSpaceText.match(/유효기간(20\d{2})년(\d{2})월(\d{2})일/);
        if (expiryMatch) {
            return `${expiryMatch[1]}-${expiryMatch[2]}-${expiryMatch[3]}`;
        }
    } else {
        const expiryMatch = noSpaceText.match(/유효기간(20\d{2})\.(\d{2})\.(\d{2})/);
        if (expiryMatch) {
            return `${expiryMatch[1]}-${expiryMatch[2]}-${expiryMatch[3]}`;
        }
    }
    return null;
};

// 교환처(매장명) 추출 함수 수정
const extractStoreName = (text) => {
    const noSpaceText = removeAllSpaces(text);
    const storeMatch = noSpaceText.match(/교환처([^유효기간 가-]+)/);
    if (storeMatch) {
        return storeMatch[1];
    }
    return null;
};

module.exports = { extractBarcodeAndText };
