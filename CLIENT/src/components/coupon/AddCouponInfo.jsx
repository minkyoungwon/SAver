import React, { useState } from "react";
import axios from "axios";
import CouponDetail from "./CouponDetail";
import { useModal } from '../../context/ModalContext';

const AddCouponInfo = ({ selectedFile }) => {
  const { openModal } = useModal();
  const [couponInfo, setCouponInfo] = useState({
    barcode: '',
    type: '',
    name: '',
    deadline: '',
    usage_location: '',
    image: '',
    user_id: '',
    status: '',
    note: '',
    categories: [],
    id: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => setErrorMessage(null);

  const fetchCouponInfo = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      console.log("API 요청 URL:", import.meta.env.VITE_API_URL); // 환경 변수 확인

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/extract`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data || Object.keys(response.data).length === 0) {
        console.error("서버 응답에 데이터가 없습니다.");
        setErrorMessage("쿠폰 정보를 추출하지 못했습니다.\n다시 시도해주세요.");
        return;
      }

      const newCouponInfo = { 
        ...response.data, 
        user_id: Number(localStorage.getItem('userId')), 
        status: '사용가능' 
      };

      setCouponInfo(newCouponInfo);
      openModal(newCouponInfo);
    } catch (error) {
      console.error("쿠폰 정보 추출 실패:", error.response?.data?.error || error.message);
      setErrorMessage(error.response?.data?.error || "쿠폰 정보를 추출하지 못했습니다.\n다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCouponInfo();
  }, [selectedFile]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80 space-y-0">
            <p className="text-black text-sm pl-6 whitespace-pre-line">{errorMessage}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="font-medium bg-gray-200 hover:bg-gray-300 text-xs px-4 py-1 rounded text-gray-600 shadow-sm"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddCouponInfo;
