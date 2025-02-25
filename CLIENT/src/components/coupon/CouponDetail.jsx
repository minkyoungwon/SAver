import { useEffect, useState } from "react";
import { Share, CustomCheckbox } from "../../icon";
import axios from "axios";
import { useModal } from '../../context/ModalContext';
import Swal from 'sweetalert2';

const CouponDetail = () => {
  const { isModalOpen, selectedCoupon, closeModal } = useModal();
  const [couponData, setCouponData] = useState(selectedCoupon || {});
  const [isUsed, setIsUsed] = useState(selectedCoupon?.is_used || false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (selectedCoupon) {
      setCouponData(selectedCoupon);
      setIsUsed(selectedCoupon.is_used || false);
    }
  }, [selectedCoupon]);

  const closeError = () => setErrorMessage(null);

  // 카테고리 추가 핸들러
  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      setCouponData(prevData => ({
        ...prevData,
        categories: [...(prevData.categories || []), newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  // 카테고리 삭제 핸들러
  const handleRemoveCategory = (indexToRemove) => {
    setCouponData(prevData => ({
      ...prevData,
      categories: prevData.categories.filter((_, index) => index !== indexToRemove)
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
  };

  // 쿠폰 삭제
  const handleDeleteCoupon = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coupons/${selectedCoupon.id}`);
      Swal.fire({ title: "쿠폰 삭제 완료", icon: "success" });
      window.location.reload();
    } catch (error) {
      console.error("쿠폰 삭제 실패:", error);
      Swal.fire({ title: "쿠폰 삭제 실패", text: "삭제할 수 없습니다.", icon: "error" });
    }
  };

  // 쿠폰 저장하기
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user_id = Number(localStorage.getItem("userId"));
      const formData = new FormData();

      // 이미지 데이터 처리
      if (couponData.image instanceof File) {
        formData.append("image", couponData.image);
      }

      formData.append("barcode", couponData.barcode || '');
      formData.append("usage_location", couponData.usage_location || '');
      formData.append("name", couponData.name || '');
      formData.append("note", couponData.note || '');
      formData.append("deadline", couponData.deadline || '');
      formData.append("categories", JSON.stringify(couponData.categories || []));
      formData.append("is_used", isUsed);
      formData.append("user_id", user_id);

      await axios.put(`${import.meta.env.VITE_API_URL}/api/coupons/${selectedCoupon.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      closeModal();
      Swal.fire({ title: "쿠폰 저장 완료", icon: "success" });
    } catch (error) {
      console.error("쿠폰 저장 실패:", error.response?.data?.error || error.message);
      setErrorMessage("쿠폰 저장에 실패했습니다.");
    }
  };

  if (!isModalOpen || !selectedCoupon) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center ">
      <div className="pb-6 px-2 w-[420px] h-[80vh] overflow-y-auto bg-stone-50 rounded-xl shadow-md">
        {/* 닫기 & 사용 체크박스 */}
        <div className="sticky top-0 z-50 pt-4 px-4 bg-stone-50 flex justify-between text-xs font-semibold text-emerald-500">
          <button className="text-sm px-2" onClick={closeModal}>X 닫기</button>
          <div className="flex justify-end gap-4">
            <div className="flex items-center">
              <CustomCheckbox onChange={handleCheckboxChange} checked={isUsed} />
              <span>사용완료</span>
            </div>
            <button className="flex items-center">
              <Share />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 바코드 입력 */}
          <div className="h-[90px] m-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4">
            <input type="text" name="barcode" value={couponData.barcode || ''} onChange={handleChange} disabled={isUsed} className="text-lg flex-1 h-full m-1 rounded-lg" />
          </div>

          {/* 쿠폰 이미지 */}
          <div className="m-4 p-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4">
            {couponData.image ? (
              <img src={`${import.meta.env.VITE_API_URL}/uploads/coupons/${couponData.image}`} alt="쿠폰 이미지" className="object-contain w-full" />
            ) : <div>이미지 없음</div>}
          </div>

          {/* 쿠폰 상세정보 */}
          <div className="m-4 p-4 space-y-4 shadow-md bg-white pr-4 pl-4 rounded-lg">
            <label>교환처</label>
            <input type="text" name="usage_location" value={couponData.usage_location || ''} onChange={handleChange} disabled={isUsed} className="w-full p-2 border rounded-lg" />

            <label>상품</label>
            <input type="text" name="name" value={couponData.name || ''} onChange={handleChange} disabled={isUsed} className="w-full p-2 border rounded-lg" />

            <label>유효기간</label>
            <input type="date" name="deadline" value={couponData.deadline || ''} onChange={handleChange} disabled={isUsed} className="w-full p-2 border rounded-lg" />

            <label>카테고리</label>
            <div>
              {couponData.categories?.map((category, index) => (
                <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                  {category}
                  <button type="button" onClick={() => handleRemoveCategory(index)}> × </button>
                </span>
              ))}
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={handleAddCategory} placeholder="카테고리 입력 후 Enter" className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          {/* 버튼 */}
          <button type="submit" className="w-full py-2 bg-emerald-400 text-white font-medium rounded-lg">저장</button>
          <button type="button" onClick={handleDeleteCoupon} className="w-full py-2 mt-2 bg-red-500 text-white font-medium rounded-lg">삭제</button>
        </form>
      </div>
    </div>
  );
};

export default CouponDetail;
