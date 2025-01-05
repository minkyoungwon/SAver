import React from "react";
import CouponDetail from "./coupon/CouponDetail";
import { useState } from "react";
import { Badge } from "@mui/material";
const CouponCard = ({ coupon }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const floatDetailModal = () => {
    if (window.innerWidth >= 768) {
      setSelectedCoupon(coupon);
    } else {
      setIsDetailModalOpen(true);
    }
    setIsDetailModalOpen(!isDetailModalOpen);
  };

  return (
    <>
      {/* <div className="flex items-center p-4 border rounded-lg shadow-md bg-white cursor-pointer" onClick={floatDetailModal}> */}
      {/* 이미지 */}
      {/* <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">{coupon.imageSrc ? <img src={coupon.imageSrc} alt={coupon.title} className="object-cover w-full h-full" /> : <span className="text-gray-500 text-sm">이미지</span>}</div> */}

      {/* 텍스트 정보 */}
      {/* <div className="ml-4 flex flex-col justify-between flex-1">
          <div>
            <div className="flex space-x-2 pb-2">
              <span className="badge">{"-7days"}</span>
              <span className="badge">{"사용가능"}</span>
            </div> */}
      {/* <p className="text-sm text-gray-400 mb-1">-7일 사용 가능</p> */}
      {/* <p className="text- font-semibold">{coupon.title}</p>
            <p className="text-sm text-gray-600">{coupon.description}</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">사용기한: {coupon.expiryDate}</p>
        </div>
      </div>
      {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} coupon={coupon} />} */}
      {/* //////////////////////////////////////////////////////////////////////////////////////// */}

      <div className="grid grid-cols-[120px_auto_70px] gap-4 p-4 border rounded-lg shadow-md bg-white cursor-pointer " onClick={floatDetailModal}>
        {/* 이미지 컬럼 */}
        <div className="h-[120px] flex items-center justify-center bg-gray-200 rounded-lg overflow-hidden">{coupon.imageSrc ? <img src={coupon.imageSrc} alt={coupon.title} className="object-cover w-full h-full" /> : <span className="text-gray-500 text-sm">이미지</span>}</div>

        {/* 텍스트 정보 컬럼 (왼쪽 정렬) */}
        <div className="flex items-top justify-start">
          <div>
            <div className="flex space-x-2 pb-3">
              <span className="badge">{"-7days"}</span>
              <span className="badge">{coupon.status}</span>
            </div>
            <div className="flex flex-col space-y-2">
              <div>
                <p className="text-base font-semibold">{coupon.title}</p>
                <p className="text-sm text-gray-600">{coupon.description}</p>
              </div>
              {coupon.remain && coupon.used && <p className="text-sm text-gray-600 font-bold">{`잔액: ${coupon.remain}원 (${coupon.used}원 사용)`}</p>}
            </div>
            <p className="text-sm text-gray-500 sm:hidden"> 유효기간: {coupon.expiryDate}</p>
          </div>
        </div>

        {/* 세 번째 (오른쪽 정렬) */}
        <div className="hidden sm:flex items-center justify-end">
          <p className="text-sm text-gray-500"> 유효기간: {coupon.expiryDate}</p>
        </div>
      </div>
      {/* 모달 */}
      {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} coupon={coupon} isMdView={false} />}
    </>
  );
};

export default CouponCard;
