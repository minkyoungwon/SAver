import ImageUploader from "./ImageUploader";

const ImageUploaderModal = ({ onImageUpload, onClose }) => {
  const handleImageUpload = (image) => {
    onImageUpload(image);
    setTimeout(() => onClose(), 200); // 이미지 등록 후 약간의 지연 후 모달 닫기
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
      <div
        className="bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg transition-transform transform scale-100"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 방지
      >
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">쿠폰 이미지 업로드</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 이미지 업로더 */}
        <ImageUploader onImageUpload={handleImageUpload} />
      </div>
    </div>
  );
};

export default ImageUploaderModal;
