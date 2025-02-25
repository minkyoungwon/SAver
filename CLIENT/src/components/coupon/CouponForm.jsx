import { useState } from "react";
import { Share, CustomCheckbox } from "../../icon";

const CouponForm = ({ 
  initialData, 
  onSubmit, 
  onClose, 
  onDelete,
  isEditMode 
}) => {
  const [couponData, setCouponData] = useState({
    barcode: initialData?.barcode || '',
    usage_location: initialData?.usage_location || '',
    note: initialData?.note || '',
    deadline: initialData?.deadline ? new Date(initialData.deadline).toISOString().split("T")[0] : '',
    categories: initialData?.categories || [],
    image: initialData?.image || null
  });

  const [isUsed, setIsUsed] = useState(initialData?.is_used || false);
  const [newCategory, setNewCategory] = useState('');

  // 카테고리 추가 핸들러
  const handleAddCategory = (e) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      e.preventDefault();
      setCouponData(prev => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim()]
      }));
      setNewCategory('');
    }
  };

  // 카테고리 삭제 핸들러
  const handleRemoveCategory = (indexToRemove) => {
    setCouponData(prev => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== indexToRemove)
    }));
  };

  // 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({ 
        ...couponData, 
        is_used: isUsed, 
        categories: JSON.stringify(couponData.categories) // 백엔드 JSON 처리
      });
    } catch (error) {
      console.error("쿠폰 저장 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="pb-6 w-[400px] h-[80vh] overflow-y-auto bg-stone-50 rounded-xl shadow-md">
        {/* 헤더 */}
        <div className="sticky top-0 z-50 pt-4 px-4 bg-stone-50 flex justify-between text-xs font-semibold text-emerald-500">
          <button className="hover:bg text-sm px-2" onClick={onClose}>
            X 닫기
          </button>
          <div className="flex justify-end gap-4">
            <div className="flex items-center">
              <CustomCheckbox 
                onChange={(e) => setIsUsed(e.target.checked)} 
                checked={isUsed} 
              />
              <span>사용완료</span>
            </div>
            {isEditMode && (
              <button className="text-sm" onClick={onDelete}>삭제</button>
            )}
            <button className="flex items-center mr-2">
              <Share />
            </button>
          </div>
        </div>

        {/* 폼 내용 */}
        <form onSubmit={handleSubmit}>
          {/* 바코드 */}
          <div className="h-[90px] m-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4">
            <input type="text" name="barcode" value={couponData.barcode} onChange={handleChange} className="text-lg flex-1 p-2 border bg-stone-50 rounded-lg" />
          </div>

          {/* 쿠폰 이미지 */}
          <div className="h-[500px] m-4 border-white rounded-lg shadow-md bg-white flex justify-center items-center mb-4">
            {couponData.image ? (
              <img 
                src={`${import.meta.env.VITE_API_URL}/uploads/coupons/${couponData.image}`} 
                alt="쿠폰 이미지"
                className="object-contain w-full h-full" 
              />
            ) : (
              <div>이미지 없음</div>
            )}
          </div>

          {/* 쿠폰 상세 정보 */}
          <div className="m-4 p-2 shadow-md bg-white pr-4 pl-4 rounded-lg">
            <div className="flex items-center">
              <label className="flex text-sm font-medium mr-7 pt-1">교환처</label>
              <input type="text" name="usage_location" value={couponData.usage_location} onChange={handleChange} className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg" />
            </div>

            <div className="flex items-start">
              <label className="flex text-sm font-medium pt-4 mr-10">상세</label>
              <input type="text" name="note" value={couponData.note} onChange={handleChange} className="text-sm flex-1 p-2 pb-12 border bg-stone-50 rounded-lg shadow-inner h-20" />
            </div>

            <div className="flex">
              <label className="flex text-sm font-medium pt-4 mr-4">유효기간</label>
              <input type="date" name="deadline" value={couponData.deadline} onChange={handleChange} className="text-sm flex-1 p-2 border bg-stone-50 rounded-lg shadow-inner" />
            </div>
          </div>

          {/* 카테고리 입력 */}
          <div className="m-4">
            <label className="text-sm pl-3 mb-2 block">카테고리</label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-lg bg-white min-h-[45px]">
              {couponData.categories.map((category, index) => (
                <span key={index} className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm flex items-center">
                  {category}
                  <button type="button" onClick={() => handleRemoveCategory(index)} className="ml-2 text-emerald-500 hover:text-emerald-700">×</button>
                </span>
              ))}
              <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} onKeyDown={handleAddCategory} placeholder="카테고리 입력 후 Enter" className="flex-1 outline-none min-w-[150px] text-sm p-1" />
            </div>
          </div>

          {/* 저장 & 닫기 버튼 */}
          <div className="flex m-4 space-x-2">
            <button type="submit" className="flex-1 py-2 bg-emerald-400 text-white font-medium rounded-lg shadow-md hover:bg-emerald-500">
              {isEditMode ? '수정' : '저장'}
            </button>
            <button type="button" className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg shadow-md hover:bg-gray-600" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm;
