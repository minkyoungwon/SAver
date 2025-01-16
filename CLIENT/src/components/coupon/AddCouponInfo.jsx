import React, { useState } from "react";
import AddCouponModal from "./AddCouponModal";
import axios from "axios";
import CouponDetail from "./CouponDetail";

const AddCouponInfo = ({ selectedFile, onModalClose, setIsModalOpen, isModalOpen }) => {
  const [couponInfo, setCouponInfo] = useState({
    barcode: '',
    type: '',
    name: '',
    deadline: '',
    usage_location: ''
  });

  const fetchCouponInfo = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons/extract`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        console.log("response.data: ", response.data);
        setCouponInfo(response.data);
        setIsModalOpen(true); // Modal 열기
      } else {
        console.error("서버 응답에 데이터가 없습니다.");
      }
    } catch (error) {
      console.error("쿠폰 정보 추출 실패:", error.response?.data || error.message);
    }
  };

  React.useEffect(() => {
    fetchCouponInfo();
  }, [selectedFile]);

  return <>{isModalOpen && <CouponDetail coupon={couponInfo} setIsDetailModalOpen={setIsModalOpen}/>}</>;
};

export default AddCouponInfo;
