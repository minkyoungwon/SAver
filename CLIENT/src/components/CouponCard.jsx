import React, { useEffect, useState } from "react";
import { useModal } from '../context/ModalContext';
import CouponEdit from "./coupon/CouponEdit";

const CouponCard = ({ coupon }) => {
  const [isUsed, setIsUsed] = useState(false);
  const { openModal, isModalOpen, closeModal } = useModal();
  const [isExpired, setIsExpired] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  const floatDetailModal = () => {
    openModal({ ...coupon, isEditMode: true });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "날짜 없음";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // 날짜 보정
    return date.toISOString().split('T')[0]; // YYYY-MM-DD 포맷
  };

  useEffect(() => {
    setIsUsed(coupon.status === 'used');
    setIsExpired(coupon.status === 'expired');

    if (coupon.deadline) {
      const today = new Date();
      const targetDate = new Date(coupon.deadline);
      const diffTime = targetDate - today;
      setRemainingDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24))); // 일수 변환
    }
  }, [coupon]);

  return (
    <>
      <div
        className="grid grid-cols-[120px_auto] md:grid-cols-[150px_auto_80px] gap-4 md:gap-6 p-4 md:p-6 border rounded-md bg-white cursor-pointer relative hover:shadow-md"
        onClick={floatDetailModal}
      >
        {/* 이미지 */}
        <div className="h-[150px] flex items-center justify-center border bg-neutral-100 rounded-3xl overflow-hidden">
          {coupon.image ? (
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/coupons/${coupon.image}`}
              alt={coupon.title}
              className="object-contain w-[150px] h-auto"
            />
          ) : (
            <span className="text-gray-500 text-sm">이미지 없음</span>
          )}
        </div>

        {/* 텍스트 정보 */}
        <div className="flex items-top pt-1 justify-start bg-white">
          <div>
            <div className="flex space-x-1 md:space-x-3 pb-3">
              {/* 남은 일수 표시 */}
              {remainingDays !== null && remainingDays >= 0 && (
                <span className="badge">{remainingDays}일 남음</span>
              )}
              {isUsed && <span className="badge bg-emerald-400 text-neutral-50">사용완료</span>}
              {isExpired && <span className="badge bg-neutral-200 text-gray-600">기간만료</span>}
              {!isUsed && !isExpired && <span className="badge bg-yellow-300 text-gray-600">사용가능</span>}
            </div>
            <div className="flex flex-col space-y-2">
              <div>
                <p className="md:pb-1 text-sm md:text-base text-gray-900 font-semibold">{coupon.name}</p>
                <p className="text-sm text-gray-900">{coupon.note}</p>
                <p className="text-sm text-gray-400">{coupon.usage_location}</p>
              </div>
            </div>
            <p className="absolute bottom-6 text-sm text-gray-900 font-semibold md:hidden">
              {formatDate(coupon.deadline)} 까지
            </p>
          </div>
        </div>

        {/* 날짜 정보 (데스크톱 화면) */}
        <div className="hidden md:flex items-center justify-end bg-white">
          <p className="text-sm text-gray-900 font-semibold">
            {formatDate(coupon.deadline)} 까지
          </p>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="relative w-[400px] bg-white p-6 rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
            >
              <CouponEdit />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CouponCard;
