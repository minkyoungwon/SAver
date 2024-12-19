import React from "react";

const CouponCard = ({ imageSrc, title, description, expiryDate }) => {
  return (
    <div className="flex items-center p-4 border rounded-lg shadow-md bg-white">
      {/* 이미지 */}
      <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="object-cover w-full h-full" />
        ) : (
          <span className="text-gray-500 text-sm">이미지</span>
        )}
      </div>

      {/* 텍스트 정보 */}
      <div className="ml-4 flex flex-col justify-between flex-1">
        <div>
          <p className="text-sm text-gray-400 mb-1">-7일 사용 가능</p>
          <p className="text-lg font-semibold">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">사용기한: {expiryDate}</p>
      </div>
    </div>
  );
};

export default CouponCard;
