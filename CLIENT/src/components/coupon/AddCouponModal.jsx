import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
const AddCouponModal = ({setIsModalOpen}) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        multiple: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        

        if (selectedFile) {
            formData.append('image', selectedFile);
        }

        try {
            // API 호출 코드...
            await axios.post('/api/coupons', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch (error) {
            console.error('쿠폰 추가 실패:', error);
        }
    };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <div>
                <span className="text-2xl font-bold mb-4">쿠폰 추가</span>
            <button className=" float-right text-gray-600 border-none font-bold text-2xl cursor-pointer flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}>
                X
            </button>
            </div>
            <div className="mt-5">
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                    {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="쿠폰 이미지" className="w-full h-full object-cover" />}
                </div>
                    <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg 
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
                        cursor-pointer hover:border-blue-500 transition-colors`}>
                        <input {...getInputProps()} />
                        <div className="text-center">
                            {selectedFile ? (
                                <div>
                                
                                <p className="text-green-600">선택된 파일: {selectedFile.name}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-600">이미지를 드래그하여 놓거나 클릭하여 선택하세요</p>
                                    <p className="text-sm text-gray-400">지원 형식: JPG, JPEG, PNG</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="bg-[#3d405b] hover:bg-[#e07a5f]/80 text-white border-none font-bold text-2xl cursor-pointer shadow-md flex items-center justify-center rounded-md">
                        추가하기
                    </button>
                </form>
            </div>


        </div>
    </div>
  )
}

export default AddCouponModal