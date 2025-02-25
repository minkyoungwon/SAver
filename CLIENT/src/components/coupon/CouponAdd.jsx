import { useModal } from '../../context/ModalContext';
import CouponForm from './CouponForm';
import axios from 'axios';
import Swal from 'sweetalert2';

const CouponAdd = () => {
  const { isModalOpen, closeModal } = useModal();

  const handleSubmit = async (formData) => {
    try {
      const user_id = Number(localStorage.getItem("userId")); // userId를 숫자로 변환
      const data = new FormData();

      // 이미지 처리 (File API 사용)
      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      // 나머지 데이터 추가
      Object.keys(formData).forEach((key) => {
        if (key !== "image") {
          data.append(
            key,
            key === "categories" ? JSON.stringify(formData[key]) : formData[key]
          );
        }
      });

      // 사용자 ID 추가
      data.append("user_id", user_id);

      await axios.post(`${import.meta.env.VITE_API_URL}/api/coupons`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      closeModal();
      Swal.fire({
        title: "쿠폰 추가 완료",
        icon: "success",
      });

      window.location.reload(); // 쿠폰 추가 후 새로고침
    } catch (error) {
      console.error("쿠폰 추가 실패:", error.response?.data?.error || error.message);
      Swal.fire({
        title: "쿠폰 추가 실패",
        text: "쿠폰 추가에 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
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
