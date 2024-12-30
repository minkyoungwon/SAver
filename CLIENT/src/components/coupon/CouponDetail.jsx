import { useEffect, useState } from "react";
import { Share, CustomCheckbox } from "../../icon";

const CouponDetail = ({ setIsModalOpen, coupon }) => {
  useEffect(() => {
    console.log("Coupon Selected: ", coupon);
  });

  //사용자 쿠폰 사용체크
  const [isUsed, setIsUsed] = useState(false);
  // 목업 데이터 (바코드, 쿠폰이미지)
  // 목업 데이터 (db데이터 받아오면, 사용자 변경 가능한 데이터들)
  const [couponData, setCouponData] = useState({
    brand: "스타벅스",
    desc: "카페아메리카노 T",
    issueDate: "2024.06.01",
    expiryDate: "2024.12.31",
  });

  // 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // 쿠폰 체크 핸들러
  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsUsed(checked);
    console.log(`쿠폰 상태: ${checked}`);

    if (checked) {
      console.log("쿠폰이 사용되었습니다.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      <div
        className="  p-4 pb-6 mr-10 w-[400px] h-[70vh] overflow-y-auto border-white bg-white rounded-xl shadow-md"
        style={
          {
            // maxHeight: "70vh", // 모달 창 최대 높이
            // clipPath: "inset(0 round 16px)",
          }
        }
      >
        {/* 공유하기 + 사용체크박스 */}
        <div className="flex justify-end text-xs font-semibold m-2 text-emerald-500 ">
          <button className="flex items-center mr-2 ">
            <Share className="mr-2" />
            공유하기
          </button>

          <div className="flex items-center">
            <CustomCheckbox />
            <span>사용완료</span>
          </div>
        </div>

        {/* 바코드  */}
        <div className="h-[90px] p-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4 ">
          <img src="barcode-placeholder.png" alt="바코드" className="h-10" />
        </div>

        {/* 쿠폰이미지 */}
        <div className="h-[500px] p-4 border-white rounded-lg drop-shadow-md bg-white flex justify-center items-center mb-4">
          <img src="coupon-image.png" alt="쿠폰 이미지" className=" rounded-lg" />
        </div>

        {/* 브랜드+상세+발급일자+유효기간 */}
        <div className="mt-4 p-2 rounded-lg shadow-md bg-gray-100 pr-4 pl-4 rounded-lg">
          {/* brand */}
          <div className="flex items-center">
            <label className=" flex text-sm font-medium mr-7 pt-1">교환처</label>
            <input type="text" name="brand" value={couponData.brand} onChange={handleChange} className=" text-sm flex-1 p-2 border rounded-lg shadow-inner " />
          </div>

          {/* desc */}
          <div className="flex items-start">
            <label className=" flex text-sm font-medium pt-4 mr-10">상세</label>
            <input type="text" name="desc" value={couponData.desc} onChange={handleChange} className=" text-sm flex-1 p-2 pb-12 border rounded-lg shadow-inner h-20" />
          </div>

          {/* 발급일 */}
          <div className="flex items-center">
            <label className=" flex text-sm font-medium pt-1 mr-4">발행일자</label>
            <input type="text" name="issueDate" value={couponData.issueDate} onChange={handleChange} className=" text-sm flex-1 p-2 border rounded-lg shadow-inner" />
          </div>

          {/* 유효기간 */}
          <div className="flex">
            <label className=" flex text-sm font-medium pt-4 mr-4">유효기간</label>
            <input type="text" name="expiryDate" value={couponData.expiryDate} onChange={handleChange} className=" text-sm flex-1 p-2 border rounded-lg shadow-inner" />
          </div>
        </div>

        {/* 카테고리지정 */}
        <div className="flex items-center mt-2">
          <label className=" flex text-sm pl-3 mr-5">카테고리</label>
          <select className=" flex-1 p-2 border-gray-100 rounded-md bg-gray-100 shadow-md">
            <option value="카페">카페</option>
          </select>
        </div>

        {/* 저장 + 닫기 */}
        <div className="flex mt-12 mb-2 space-x-2">
          <button type="submit" className="flex-1 py-2 bg-emerald-400 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500">
            저장
          </button>
          <button className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600" onClick={() => setIsModalOpen(false)}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponDetail;
