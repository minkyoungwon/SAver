import { useEffect, useState } from "react";
import { Share, CustomCheckbox } from "../../icon";
import axios from "axios";

const CouponDetail = ({ setIsDetailModalOpen, coupon }) => {
  useEffect(() => {
    console.log("Coupon Selected: ", coupon);
  }, [coupon]);

  //사용자 쿠폰 사용체크
  const [isUsed, setIsUsed] = useState(false);

  // 목업 데이터 (바코드, 쿠폰이미지)
  // 목업 데이터 (db데이터 받아오면, 사용자 변경 가능한 데이터들)
  const [couponData, setCouponData] = useState({
    name: coupon.name,
    note: coupon.note,
    deadline: coupon.deadline,
    categories: coupon.categories,
    status: coupon.status,
    coupon_image: coupon.coupon_image,
    usage_location: coupon.usage_location,
    id: coupon.id,
    image: coupon.image
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

  // 모달 닫기 핸들러 추가
  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_API_URL}/api/coupon/${coupon.id}`, couponData)
      .then(() => {
        handleCloseModal(); // 저장 성공 후 모달 닫기
      })
      .catch((error) => {
        console.error('쿠폰 업데이트 실패:', error);
      });
  };

  // Buffer 데이터를 Base64로 변환하는 함수 수정
  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return '';
    const bytes = new Uint8Array(buffer.data);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      <div className="pb-6 w-[400px] h-[80vh] overflow-y-auto no-scrollbar bg-stone-50 rounded-xl shadow-md">
        {/* 공유하기 + 사용체크박스 */}
        <div className=" sticky top-0 z-50 pt-4 px-4 bg-stone-50 flex justify-between text-xs font-semibold  text-emerald-500 ">
          <button
            className="hover:bg text-sm px-2"
            onClick={handleCloseModal}
          >
            X 닫기
          </button>
          <div className="flex justify-end gap-4 ">
            <div className="flex items-center">
              <CustomCheckbox onChange={handleCheckboxChange} checked={isUsed} />
              <span>사용완료</span>
            </div>
            <button className="flex items-center mr-2 ">
              <Share />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          {/* 바코드  */}
          <div className="h-[90px] m-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4 ">
            <img src="barcode-placeholder.png" alt="바코드" className="h-10" />
          </div>

          {/* 쿠폰이미지 */}
          <div className="h-[500px] m-4 border-white rounded-lg drop-shadow-md bg-white flex justify-center items-center mb-4">
            {couponData.image ? (
              <img 
                src={`data:image/jpeg;base64,${bufferToBase64(couponData.image)}`} 
                alt="쿠폰 이미지" 
                className="rounded-lg" 
              />
            ) : (
              <div>이미지 없음</div>
            )}
          </div>

          {/* 브랜드+상세+유효기간 */}
          <div className=" m-4 p-2  shadow-md bg-white pr-4 pl-4 rounded-lg">
            {/* brand */}
            <div className="flex items-center">
              <label className="flex text-sm font-medium mr-7 pt-1">교환처</label>
              <input 
                type="text" 
                name="usage_location" 
                value={couponData.usage_location} 
                onChange={handleChange} 
                className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg" 
              />
            </div>

            {/* desc */}
            <div className="flex items-start">
              <label className="flex text-sm font-medium pt-4 mr-10">상세</label>
              <input 
                type="text" 
                name="note" 
                value={couponData.note} 
                onChange={handleChange} 
                className="text-sm flex-1 p-2 pb-12 border bg-stone-50 rounded-lg shadow-inner h-20" 
              />
            </div>

            {/* 유효기간 */}
            <div className="flex">
              <label className="flex text-sm font-medium pt-4 mr-4">유효기간</label>
              <input 
                type="text" 
                name="deadline" 
                value={couponData.deadline} 
                onChange={handleChange} 
                className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg shadow-inner" 
              />
            </div>
          </div>

          {/* 카테고리지정 */}
          <div className="flex items-center m-4 ">
            <label className=" flex text-sm pl-3 mr-5">카테고리</label>
            <select 
              name="categories"
              value={couponData.categories}
              onChange={handleChange}
              className="flex-1 p-2 border-gray-100 rounded-md bg-gray-100 shadow-md"
            >
              <option value="">{couponData.categories}</option>
            </select>
          </div>

          {/* 저장 + 닫기 */}
          <div className="flex m-4 space-x-2">
            <button type="submit" className="flex-1 py-2 bg-emerald-400 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500">
              저장
            </button>
            <button
              type="button"
              className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600"
              onClick={handleCloseModal}
            >
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponDetail;
