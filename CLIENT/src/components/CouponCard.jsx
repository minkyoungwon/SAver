import React, { useEffect, useState } from "react";
import { useModal } from '../context/ModalContext';
import CouponEdit from "./coupon/CouponEdit";

const CouponCard = ({ coupon }) => {
  const [isUsed, setIsUsed] = useState(false);
  const { openModal, isModalOpen, closeModal } = useModal();
  const [isExpired, setIsExpired] = useState(false);
  // console.log("coupon: ", coupon);
  const floatDetailModal = () => {
    openModal({
      ...coupon,
      isEditMode: true
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // 날짜를 1일 증가시킴 (coupon.deadline이 실제 날자보다 1일 적어서 임의로 +1시킴)
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 포맷 반환
  };

  const getRemainingDays = (deadline) => {
    const today = new Date();
    const targetDate = new Date(deadline);
    const diffTime = targetDate - today; // 차이 (밀리초)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 밀리초 → 일수
    return diffDays;
  };


  useEffect(() => {
    setIsUsed(coupon.status === 'used');
    setIsExpired(coupon.status === 'expired');
  }, [coupon.status]);


  const handleModalClose = () => {
    closeModal();
  };

  return (
    <>
      <div className="grid grid-cols-[120px_auto] md:grid-cols-[150px_auto_80px] gap-4 md:gap-6 p-4 md:p-6 border rounded-md  bg-white cursor-pointer relative hover:shadow-md " onClick={floatDetailModal}>
        {/* 이미지 컬럼 */}
        <div className="h-[150px] flex items-center justify-center border bg-neutral-100 rounded-3xl overflow-hidden">
          {coupon.image ?
            <img
              src={`http://18.212.90.82:5000/uploads/coupons/${coupon.image}`} alt={coupon.title} className="object-contain w-[150px] h-auto" /> : <span className="text-gray-500 text-sm">이미지</span>}</div>

        {/* 텍스트 정보 컬럼 (왼쪽 정렬) */}
        <div className="flex items-top pt-1 justify-start bg-white">
          <div>
            <div className="flex space-x-1 md:space-x-3 pb-3">
              {/* 남은 일수가 양수일 때만 뱃지를 렌더링(0일 포함, -1부터 뱃지 없음)*/}
              {getRemainingDays(coupon.deadline) >= 0 && (
                <span className="badge">{getRemainingDays(coupon.deadline)}일 남음</span>
              )}
              {isUsed && <span className="badge bg-emerald-400 text-neutral-50">사용완료</span>}
              {isExpired && <span className="badge bg-neutral-200 text-gray-600">기간만료</span>}
              {!isUsed && !isExpired && <span className="badge bg-yellow-300 text-gray-600">사용가능</span>}
              {/* <span className="badge">{isUsed ? "사용완료" : "사용가능"}</span> */}
            </div>
            <div className="flex flex-col space-y-2">
              <div>
                <p className="md:pb-1 text-sm md:text-base text-gray-900 font-semibold">{coupon.name}</p>
                <p className="text-sm  text-gray-900">{coupon.note}</p>
                <p className="text-sm  text-gray-400">{coupon.usage_location}</p>
              </div>
            </div>
            <p className="absolute bottom-6 text-sm text-gray-900 font-semibold md:hidden"> {formatDate(coupon.deadline)} 까지 </p>
          </div>
        </div>

        {/* 세 번째 (오른쪽 정렬) */}
        <div className="hidden md:flex items-center justify-end bg-white">
          <p className="text-sm text-gray-900 font-semibold"> {formatDate(coupon.deadline)} 까지</p>
        </div>

        {isModalOpen && (
          <CouponEdit />
        )}
      </div>
    </>
  );
};

export default CouponCard;
