import CouponDetail from "./CouponDetail";
import { useState } from "react";
const AddCoupon2 = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const floatDetailModal = () => {
    setIsDetailModalOpen(!isDetailModalOpen);
  };
  return (
    <>
      <div className="fixed bottom-10 right-20 z-50">
        <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 border-none font-bold text-2xl cursor-pointer shadow-md flex items-center justify-center" onClick={floatModal}>
          +
        </button>
      </div>
      {isDetailModalOpen && <CouponDetail setIsDetailModalOpen={setIsDetailModalOpen} />}
    </>
  );
};

export default AddCoupon2;
