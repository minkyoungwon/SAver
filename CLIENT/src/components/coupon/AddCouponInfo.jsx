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

  const [errorMessage, setErrorMessage] = useState(null); // 에러 메시지 상태 추가

  const closeModal = () => {
    //에러창 닫기
    setErrorMessage(null);
  };

  const fetchCouponInfo = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/extract`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        const newCouponInfo = { ...response.data, user_id: localStorage.getItem('userId'), status: '사용가능' };
        setCouponInfo(newCouponInfo);
        openModal(newCouponInfo);
      } else {
        console.error("서버 응답에 데이터가 없습니다.");
        setErrorMessage("쿠폰 정보를 추출하지 못했습니다.\n다시 시도해주세요.(데이터못받음)");
      }
    } catch (error) {
      console.error("쿠폰 정보 추출 실패:", error.response?.data || error.message);
      setErrorMessage("쿠폰 정보를 추출하지 못했습니다.\n다시 시도해주세요.");
    }
  };

  React.useEffect(() => {
    fetchCouponInfo();
  }, [selectedFile]);

  return (
    <>
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
  );;
};

export default AddCouponInfo;
