import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    console.log("ImageUploader: 선택된 파일:", acceptedFiles[0]);
    setSelectedFile(acceptedFiles[0]);
  }, []);

  const handleUploadClick = () => {
    console.log("ImageUploader: 등록 버튼 클릭 - 전달될 파일:", selectedFile);
    if (selectedFile && onImageUpload) {
      onImageUpload(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-1 flex justify-center  w-full bg-white  border border-dashed rounded-3xl mb-5
                    ${isDragActive ? "border-emerald-400 bg-blue-50" : "border-gray-400"}
                    cursor-pointer hover:border-emerald-400 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="text-center py-2">
          {selectedFile ? (
            <p className="text-sm text-emerald-500 ">{selectedFile.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
              <p className="text-xs text-gray-400">지원 형식: JPG, JPEG, PNG</p>
            </>
          )}
          {selectedFile && (
            <div className="w-full h-80  border-gray-300 mt-2 p-2 mb-2 flex items-start justify-center rounded-xl overflow-hidden" style={{ overflow: "auto", scrollbarWidth: "none" }}>
              <img src={URL.createObjectURL(selectedFile)} alt="업로드된 이미지" className="object-contain" style={{ width: "70%", height: "auto" }} />
            </div>
          )}
        </div>
      </div>

      <div>
        {selectedFile && (
          <button onClick={handleUploadClick} className="btn-primary-r w-full rounded-2xl p-3">
            쿠폰 등록하기
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;

