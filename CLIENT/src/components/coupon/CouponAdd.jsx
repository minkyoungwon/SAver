import { useModal } from '../../context/ModalContext';
import CouponForm from './CouponForm';
import axios from 'axios';

const CouponAdd = () => {
  const { isModalOpen, closeModal } = useModal();

  const handleSubmit = async (formData) => {
    const data = new FormData();
    
    // 이미지 처리
    if (formData.image) {
      const response = await fetch(formData.image);
      const blob = await response.blob();
      data.append('image', blob, 'coupon_image.jpg');
    }

    // 나머지 데이터 추가
    Object.keys(formData).forEach(key => {
      if (key !== 'image') {
        data.append(key, 
          key === 'categories' ? JSON.stringify(formData[key]) : formData[key]
        );
      }
    });

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/coupons`, 
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      closeModal();
      alert("쿠폰이 추가되었습니다.");
    } catch (error) {
      console.error('쿠폰 추가 실패:', error);
      alert('쿠폰 추가에 실패했습니다.');
    }
  };

  if (!isModalOpen) return null;

  return (
    <CouponForm
      onSubmit={handleSubmit}
      onClose={closeModal}
      isEditMode={false}
    />
  );
};

export default CouponAdd; 