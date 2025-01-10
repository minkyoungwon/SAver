import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const AddCouponModal = ({setIsModalOpen}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [couponInfo, setCouponInfo] = useState({
        type: '',
        productName: '',
        expiryDate: '',
        storeName: '',
        orderNumber: ''
    });

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCouponInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`${import.meta.env.VITE_API_URL}/api/coupon`, couponInfo);
        setIsModalOpen(false);
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
                <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
                    {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="쿠폰 이미지" className="w-full h-full object-contain" />}
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
                            {couponInfo && (
                                <div>
                                {couponInfo && (
                                    <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">쿠폰 종류</label>
                                                <input
                                                    type="text"
                                                    name="type"
                                                    value={couponInfo.type}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">상품명</label>
                                                <input
                                                    type="text"
                                                    name="productName"
                                                    value={couponInfo.productName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">유효기간</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={couponInfo.expiryDate}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">매장명</label>
                                                <input
                                                    type="text"
                                                    name="storeName"
                                                    value={couponInfo.storeName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700">주문번호</label>
                                                <input
                                                    type="text"
                                                    name="orderNumber"
                                                    value={couponInfo.orderNumber}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            )}
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