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
        className={`p-1 flex justify-center w-full  border rounded-full bg-white
                    ${isDragActive ? "border-emerald-200 bg-blue-50" : "border-gray-300"}
                    cursor-pointer hover:border-emerald-200 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="text-center py-1 space-y-1">
          {selectedFile ? (
            <p className="text-sm text-emerald-400">선택된 파일: {selectedFile.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
              <p className="text-xs text-gray-400">지원 형식: JPG, JPEG, PNG</p>
            </>
          )}
        </div>
      </div>
      <div>
        {selectedFile && (
          <div className="w-full h-80 bg-black mt-2 p-2 flex items-start justify-center rounded-t-3xl overflow-hidden" style={{ overflow: "auto", scrollbarWidth: "none" }}>
            <img src={URL.createObjectURL(selectedFile)} alt="업로드된 이미지" className="object-contain" style={{ width: "50%", height: "auto" }} />
          </div>
        )}
        {selectedFile && (
          <button onClick={handleUploadClick} className="w-full justify-center bg-black  text-emerald-300 hover:bg-emerald-300 hover:text-emerald-700 text-md font-semibold rounded-b-3xl p-3 ">
            쿠 폰 등 록 하 기
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
