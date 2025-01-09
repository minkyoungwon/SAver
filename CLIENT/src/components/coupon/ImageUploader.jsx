import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const ImageUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);

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
        className={`p-1 border rounded-lg bg-white
                    ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"} 
                    cursor-pointer hover:border-blue-500 transition-colors`}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          {selectedFile ? (
            <p className="text-green-600">선택된 파일: {selectedFile.name}</p>
          ) : (
            <>
              <p className="text-sm text-gray-600">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
              <p className="text-xs text-gray-400">지원 형식: JPG, JPEG, PNG</p>
            </>
          )}
        </div>
      </div>
      <div className="w-full h-80 bg-gray-100 flex items-start justify-center rounded-md overflow-hidden" style={{ overflow: "auto", scrollbarWidth: "none" }}>
        {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="업로드된 이미지" className="object-contain" style={{ width: "50%", height: "auto" }} />}
      </div>
      <button className=""> 등록하기 </button>
    </div>
  );
};

export default ImageUploader;
