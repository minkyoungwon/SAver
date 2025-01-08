import { useEffect, useState } from "react";
import { Share, CustomCheckbox } from "../../icon";

const CouponDetail = ({ setIsDetailModalOpen, setSelectedCoupon, coupon, isMdView }) => {
  console.log("CouponDetail props:", { coupon, isMdView });
  if (!coupon) return <div>쿠폰 데이터를 불러오는 중입니다...</div>;

  useEffect(() => {
    console.log("Coupon Selected: ", coupon);
  }, [coupon]);

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
    <div
      className={`${
        isMdView
          ? "w-full h-auto" // 4section 안에서 배치
          : "fixed inset-0 z-50 flex justify-center items-center" // 중앙 fixed 모달
      }`}
    >
      <div className="pb-6 mr-10 w-[380px] h-[70vh] overflow-y-auto no-scrollbar bg-stone-50 rounded-xl shadow-md">
        {/* 공유하기 + 사용체크박스 */}
        <div className=" sticky top-0 z-50 pt-4 px-4 bg-stone-50 flex justify-between text-xs font-semibold  text-emerald-500 ">
          <button
            className="hover:bg text-sm px-2"
            onClick={() => {
              setIsDetailModalOpen(false); // 모달 상태 닫기 (모바일)
              setSelectedCoupon(null); // 선택된 쿠폰 초기화 (데스크톱)
            }}
          >
            X 닫기
          </button>
          <div className="flex justify-end gap-4 ">
            <div className="flex items-center">
              <CustomCheckbox />
              <span>사용완료</span>
            </div>
            <button className="flex items-center mr-2 ">
              <Share />
            </button>
          </div>
        </div>

        {/* 바코드  */}
        <div className="h-[90px] m-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4 ">
          <img src="barcode-placeholder.png" alt="바코드" className="h-10" />
        </div>

        {/* 쿠폰이미지 */}
        <div className="h-[500px] m-4 border-white rounded-lg drop-shadow-md bg-white flex justify-center items-center mb-4">
          <img src="coupon-image.png" alt="쿠폰 이미지" className=" rounded-lg" />
        </div>

        {/* 브랜드+상세+발급일자+유효기간 */}
        <div className=" m-4 p-2  shadow-md bg-white pr-4 pl-4 rounded-lg">
          {/* brand */}
          <div className="flex items-center">
            <label className=" flex text-sm font-medium mr-7 pt-1">교환처</label>
            <input type="text" name="brand" value={couponData.brand} onChange={handleChange} className=" text-sm flex-1 p-2 border bg-stone-50 rounded-lg  " />
          </div>

          {/* desc */}
          <div className="flex items-start">
            <label className=" flex text-sm font-medium pt-4 mr-10">상세</label>
            <input type="text" name="desc" value={couponData.desc} onChange={handleChange} className=" text-sm flex-1 p-2 pb-12 border bg-stone-50 rounded-lg shadow-inner h-20" />
          </div>

          {/* 발급일 */}
          <div className="flex items-center">
            <label className=" flex text-sm font-medium pt-1 mr-4">발행일자</label>
            <input type="text" name="issueDate" value={couponData.issueDate} onChange={handleChange} className=" text-sm flex-1 p-2 border bg-stone-50 rounded-lg shadow-inner" />
          </div>

          {/* 유효기간 */}
          <div className="flex">
            <label className=" flex text-sm font-medium pt-4 mr-4">유효기간</label>
            <input type="text" name="expiryDate" value={couponData.expiryDate} onChange={handleChange} className=" text-sm flex-1 p-2 border bg-stone-50 rounded-lg shadow-inner" />
          </div>
        </div>

        {/* 카테고리지정 */}
        <div className="flex items-center m-4 ">
          <label className=" flex text-sm pl-3 mr-5">카테고리</label>
          <select className=" flex-1 p-2 border-gray-100 rounded-md bg-gray-100 shadow-md">
            <option value="{category}">카페</option>
          </select>
        </div>

        {/* 저장 + 닫기 */}
        <div className="flex m-4 space-x-2">
          <button type="submit" className="flex-1 py-2 bg-emerald-400 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500">
            저장
          </button>
          <button
            className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600"
            onClick={() => {
              setIsDetailModalOpen(false); // 모달 상태 닫기 (모바일)
              setSelectedCoupon(null); // 선택된 쿠폰 초기화 (데스크톱)
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponDetail;
