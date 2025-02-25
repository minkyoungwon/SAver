import { useState } from "react";
import axios from "axios";

const AddCouponModal = ({ setIsModalOpen, couponInfo: initialCouponInfo }) => {
  const [couponInfo, setCouponInfo] = useState(initialCouponInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = Number(localStorage.getItem("userId")); // userId를 숫자로 변환
      const couponData = {
        ...couponInfo,
        user_id: userId, // 백엔드와 필드명 일치
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons`, couponData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("쿠폰 추가 중 오류 발생:", error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">쿠폰 추가</span>
          <button
            className="text-gray-600 border-none font-bold text-2xl cursor-pointer"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="mt-5">
          {couponInfo && (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
                    name="name" // productName → name 변경
                    value={couponInfo.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">유효기간</label>
                  <input
                    type="text"
                    name="deadline" // expirationDate → deadline 변경
                    value={couponInfo.deadline}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">매장명</label>
                  <input
                    type="text"
                    name="usage_location" // storeName → usage_location 변경
                    value={couponInfo.usage_location}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">바코드</label>
                  <input
                    type="text"
                    name="barcode"
                    value={couponInfo.barcode}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-[#3d405b] hover:bg-[#e07a5f]/80 text-white border-none font-bold text-lg cursor-pointer shadow-md flex items-center justify-center rounded-md py-2 mt-4"
              >
                추가하기
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCouponModal;
