import { useEffect, useState } from "react";
import { Share, CustomCheckbox } from "../../icon";
import axios from "axios";
import { useModal } from '../../context/ModalContext';

const CouponDetail = () => {
  const { isModalOpen, selectedCoupon, closeModal } = useModal();

  // 쿠폰 데이터 상태 추가
  const [couponData, setCouponData] = useState(selectedCoupon || {});
  const [isUsed, setIsUsed] = useState(selectedCoupon?.is_used || false);

  // 에러 메시지 상태 추가
  const [errorMessage, setErrorMessage] = useState(null);
  // 에러창 닫기
  const closeError = () => {
    setErrorMessage(null);
  };

  // selectedCoupon이 변경될 때마다 couponData 업데이트
  useEffect(() => {
    if (selectedCoupon) {
      setCouponData(selectedCoupon);
      setIsUsed(selectedCoupon.is_used || false);
    }
  }, [selectedCoupon]);


  // 카테고리 관리를 위한 새로운 상태
  const [newCategory, setNewCategory] = useState('');

  // 카테고리 추가 핸들러
  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      setCouponData(prevData => ({
        ...prevData,
        categories: Array.isArray(prevData.categories)
          ? [...prevData.categories, newCategory.trim()]
          : [newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  // 카테고리 삭제 핸들러
  const handleRemoveCategory = (indexToRemove) => {
    setCouponData(prevData => ({
      ...prevData,
      categories: Array.isArray(prevData.categories)
        ? prevData.categories.filter((_, index) => index !== indexToRemove)
        : []
    }));
  };

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
    setCouponData((prevData) => ({
      ...prevData,
      is_used: checked,
    }));
    console.log(`쿠폰 상태: ${checked}`);

    if (checked) {
      console.log("쿠폰이 사용되었습니다.");
    }
  };
  const handleDeleteCoupon = async () => {
    console.log("쿠폰 삭제");

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/coupons/${selectedCoupon.id}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log(response.data.message);
  };

  // 쿠폰 저장하기
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // 이미지 데이터 처리 개선
    if (selectedCoupon.image) {
      // Buffer 데이터인 경우
      if (selectedCoupon.image.data) {
        const base64String = bufferToBase64(selectedCoupon.image);
        const base64Response = await fetch(`data:image/jpeg;base64,${base64String}`);
        const imageBlob = await base64Response.blob();
        formData.append('image', imageBlob, 'coupon_image.jpg');
      }
      // 이미 문자열 형태의 이미지 URL인 경우
      else if (typeof selectedCoupon.image === 'string') {
        const imageResponse = await fetch(selectedCoupon.image);
        const imageBlob = await imageResponse.blob();
        formData.append('image', imageBlob, 'coupon_image.jpg');
      }
    }

    // 필수 데이터 추가
    formData.append('barcode', couponData.barcode || '');
    formData.append('usage_location', couponData.usage_location || '');
    formData.append('name', couponData.name || '');
    formData.append('deadline', couponData.deadline || '');
    formData.append('categories', JSON.stringify(couponData.categories || []));
    formData.append('is_used', isUsed);
    formData.append('user_id', couponData.user_id);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      closeModal();
      alert("쿠폰 저장 완료");
    } catch (error) {
      console.error('쿠폰 저장 실패:', error);
      setErrorMessage('쿠폰 저장에 실패했습니다.');
    }
  };

  // Buffer 데이터를 Base64로 변환하는 함수 수정
  const bufferToBase64 = (buffer) => {
    if (!buffer || !buffer.data) return '';
    const bytes = new Uint8Array(buffer.data);
    let binary = '';
    bytes.forEach(byte => binary += String.fromCharCode(byte));
    return window.btoa(binary);
  };

  if (!isModalOpen || !selectedCoupon) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      <div className="pb-6 px-2 w-[420px] h-[80vh] overflow-y-auto no-scrollbar bg-stone-50 rounded-xl shadow-md">
        {/* 공유하기 + 사용체크박스 */}
        <div className=" sticky top-0 z-50 pt-4 px-4 bg-stone-50 flex justify-between text-xs font-semibold  text-emerald-500 ">
          <button
            className="hover:bg text-sm px-2"
            onClick={closeModal}
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
            <input type="text" name="barcode" value={couponData.barcode} onChange={handleChange} disabled={isUsed} className="text-lg flex-1 h-full m-1 rounded-lg" />
          </div>

          {/* 쿠폰이미지 */}
          <div className={`m-4 p-4 border-white rounded-lg drop-shadow-md bg-white flex justify-center items-center mb-4 ${isUsed ? "grayscale" : ""
            }`}
          >
            {couponData.image ? (
              <img
                src={`http://localhost:5000${couponData.image}`}
                alt="쿠폰 이미지"
                className="object-contain w-full"
              />
            ) : (
              <div>이미지 없음</div>
            )}
          </div>

          {/* 브랜드+상세+유효기간 */}
          <div className=" m-4 p-4 space-y-4 shadow-md bg-white pr-4 pl-4 rounded-lg">
            {/* brand */}
            <div className="flex items-center">
              <label className="flex text-sm font-medium mr-7 pt-2">교환처</label>
              <input
                type="text"
                name="usage_location"
                value={couponData.usage_location}
                onChange={handleChange}
                disabled={isUsed}
                className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg"
              />
            </div>

            {/* desc */}
            <div className="flex items-start">
              <label className="flex text-sm font-medium pt-2 mr-10">상품</label>
              <input
                type="text"
                name="name"
                value={couponData.name}
                onChange={handleChange}
                disabled={isUsed}
                className="text-sm flex-1 p-2 pb-12 border bg-stone-50 rounded-lg shadow-inner h-20"
              />
            </div>

            {/* 유효기간 */}
            <div className="flex">
              <label className="flex text-sm font-medium pt-2 mr-4">유효기간</label>
              <input
                type="text"
                name="deadline"
                value={
                  couponData.deadline
                    ? (() => {
                      const date = new Date(couponData.deadline);
                      date.setDate(date.getDate() + 1); // 날짜에 1일 추가
                      return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 반환
                    })()
                    : ""
                }
                onChange={handleChange}
                disabled={isUsed}
                className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg shadow-inner"
              />
            </div>

            {/* 카테고리 입력 UI 부분 */}
            <div className="flex">
              <label className="flex text-sm font-medium pt-2 mr-4">카테고리</label>
              <div className="flex-1 w-full">
                {Array.isArray(couponData.categories) && couponData.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {category}
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(index)}
                      className="ml-2 text-emerald-500 hover:text-emerald-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={handleAddCategory}
                  placeholder="카테고리 입력 후 Enter"
                  className="flex-1 w-full text-sm p-2 border bg-stone-50 rounded-lg shadow-inner"
                />
              </div>
            </div>

          </div>
          <div className="flex m-4">
            <button className="flex w-full justify-center border text-sm py-2 rounded-lg hover:font-semibold" onClick={handleDeleteCoupon}>쿠폰삭제하기</button>
          </div>

          {/* 저장 + 닫기 */}
          <div className="flex m-4 space-x-2">
            <button type="submit" className="flex-1 py-2 bg-emerald-400 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500">
              저장
            </button>
            <button
              type="button"
              className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600"
              onClick={closeModal}
            >
              닫기
            </button>
          </div>
        </form>
      </div >

      {/* errorMessage */}
      <>
        {errorMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-80 space-y-0">
              <p className="text-black text-sm pl-6 whitespace-pre-line">{errorMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={closeError}
                  className="font-medium bg-gray-200 hover:bg-gray-300 text-xs px-4 py-1 rounded text-gray-600 shadow-sm"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    </div >
  );
};

export default CouponDetail;
