const modal = document.getElementById('myModal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementsByClassName('close')[0];
const addImageBtn = document.getElementById('addImageBtn');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const infoModal = document.getElementById('infoModal');
const imagePreviewInModal = document.getElementById('imagePreviewInModal');
const barcode = document.getElementById('barcode');
const productName = document.getElementById('productName');
const usagePlace = document.getElementById('usagePlace');
const expiryDate = document.getElementById('expiryDate');
const submitBtn = document.getElementById('submitBtn');

// 첫 번째 모달 열기
openModalBtn.onclick = function () {
    modal.style.display = 'block';
};

// 첫 번째 모달 닫기
closeModalBtn.onclick = function () {
    modal.style.display = 'none';
    imagePreview.innerHTML = ''; // 이미지 미리보기 초기화
};

// 이미지 미리보기
imageInput.onchange = function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreview.innerHTML = ''; // 기존 미리보기 제거
            imagePreview.appendChild(img); // 새 이미지 추가
        };
        reader.readAsDataURL(file);
    }
};

// "추가하기" 버튼 클릭 시 두 번째 모달 열기
addImageBtn.onclick = function () {
    if (imagePreview.innerHTML) {
        const file = imageInput.files[0]; // 첨부된 파일 가져오기
        if (!file) {
            alert('이미지를 첨부해주세요!');
            return;
        }

        //formData 객체 생성성
        const formData = new FormData();

        //이미지 파일 추가
        formData.append('image', file);

        fetch('/coupon-images', {
            method: 'POST',
            body: formData,
        }).then((response) => {
            if (!response.ok) {
                throw new Error('이미지 업로드 실패');
            }
            console.log(response);
            // return response.json();
        });
        // .then((data) => {
        //     console.log('서버 응답:', data);

        //     const imgSrc = imagePreview.querySelector('img').src;
        //     const imgInModal = document.createElement('img');
        //     imgInModal.src = imgSrc;
        //     imagePreviewInModal.innerHTML = ''; // 기존 이미지 제거
        //     imagePreviewInModal.appendChild(imgInModal); // 새 이미지 추가

        //     modal.style.display = 'none'; // 첫 번째 모달 닫기
        //     infoModal.style.display = 'block'; // 두 번째 모달 열기
        // });
    } else {
        alert('이미지를 첨부해주세요!');
    }
};

// 두 번째 모달 닫기
const closeInfoModalBtn = infoModal.querySelector('.close');
closeInfoModalBtn.onclick = function () {
    infoModal.style.display = 'none';
};

// "등록" 버튼 클릭 시 입력한 정보 출력
// submitBtn.onclick = function () {
//     alert(
//         '쿠폰이 등록되었습니다! \n' +
//             '바코드: ' +
//             barcode.value +
//             '\n' +
//             '상품명: ' +
//             productName.value +
//             '\n' +
//             '사용처: ' +
//             usagePlace.value +
//             '\n' +
//             '유효기간: ' +
//             expiryDate.value
//     );

//     // 모든 입력 필드 초기화
//     barcode.value = '';
//     productName.value = '';
//     usagePlace.value = '';
//     expiryDate.value = '';
//     infoModal.style.display = 'none'; // 두 번째 모달 닫기
// };
