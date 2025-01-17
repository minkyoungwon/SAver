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
    categories: []
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
        const newCouponInfo = {...response.data, user_id: localStorage.getItem('userId'), status: '사용가능'};
        setCouponInfo(newCouponInfo);
        openModal(newCouponInfo);
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

  return null;
};

export default AddCouponInfo;
