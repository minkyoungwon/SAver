import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const AddCouponModal = ({setIsModalOpen}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [couponInfo, setCouponInfo] = useState(null);

    const onDrop = useCallback( async (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    }, []);

    useEffect(() => {
        extractCouponInfo();
    },[selectedFile])

    const extractCouponInfo = async () => {
        if (!selectedFile) return;
        
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            
            // FormData 내용 확인
            for (let pair of formData.entries()) {
                console.log('FormData 내용:', pair[0], pair[1]);
            }

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupon/extract`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (!response.data) {
                console.error('서버 응답에 데이터가 없습니다');
                return;
            }
            
            console.log("쿠폰 정보 응답:", response);
            setCouponInfo(response.data);
        } catch (error) {
            console.error('쿠폰 정보 추출 중 오류 발생:', error.response?.data || error.message);
        }
    }
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupon`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if(response.status === 200) {
                alert('쿠폰 추가 성공!');
                setIsModalOpen(false);
            }
        } catch (error) {
            console.error('쿠폰 추가 실패:', error);
            setIsModalOpen(false);
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
                <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
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
                                    <div>
                                        <h3>쿠폰 정보</h3>
                                        {couponInfo && (
                                            <>
                                                <p>쿠폰 종류: {couponInfo.type}</p>
                                                <p>상품명: {couponInfo.productName}</p>
                                                <p>유효기간: {couponInfo.expiryDate}</p>
                                                <p>매장명: {couponInfo.storeName}</p>
                                                <p>주문번호: {couponInfo.orderNumber}</p>
                                            </>
                                        )}
                                    </div>
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