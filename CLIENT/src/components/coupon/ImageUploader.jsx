import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      console.log("ImageUploader: 선택된 파일:", acceptedFiles[0]);
      setSelectedFile(acceptedFiles[0]);
      setPreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview); // 미리보기 URL 해제 (메모리 누수 방지)
    };
  }, [preview]);

  const handleUploadClick = () => {
    console.log("ImageUploader: 등록 버튼 클릭 - 전달될 파일:", selectedFile);
    if (selectedFile && typeof onImageUpload === "function") {
      onImageUpload(selectedFile);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`p-1 flex justify-center w-full bg-white border border-dashed rounded-3xl mb-5
                    ${isDragActive ? "border-emerald-400 bg-blue-50" : "border-gray-400"}
                    cursor-pointer hover:border-emerald-400 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="text-center py-2">
          {selectedFile ? (
            <p className="text-sm text-emerald-500">{selectedFile.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
              <p className="text-xs text-gray-400">지원 형식: JPG, JPEG, PNG</p>
            </>
          )}
          {preview && (
            <div className="w-full h-80 border-gray-300 mt-2 p-2 mb-2 flex items-center justify-center rounded-xl overflow-hidden">
              <img src={preview} alt="업로드된 이미지" className="object-contain" style={{ width: "70%", height: "auto" }} />
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
