import { useModal } from '../../context/ModalContext';
import CouponForm from './CouponForm';
import axios from 'axios';
import Swal from 'sweetalert2';

const CouponEdit = () => {
  const { isModalOpen, selectedCoupon, closeModal } = useModal();

  const handleSubmit = async (formData) => {
    try {
      const user_id = Number(localStorage.getItem("userId")); // userId를 숫자로 변환
      const data = new FormData();

      // 이미지 처리
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

      await axios.put(`${import.meta.env.VITE_API_URL}/api/coupons/${selectedCoupon.id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      closeModal();
      Swal.fire({
        title: "쿠폰 수정 완료",
        icon: "success",
      });

      window.location.reload(); // 쿠폰 수정 후 새로고침
    } catch (error) {
      console.error("쿠폰 수정 실패:", error.response?.data?.error || error.message);
      Swal.fire({
        title: "쿠폰 수정 실패",
        text: "쿠폰 수정에 실패했습니다.",
        icon: "error",
        timer: 3000,
      });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말로 이 쿠폰을 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/coupons/${selectedCoupon.id}`);
      Swal.fire({
        title: "쿠폰 삭제 완료",
        icon: "success",
      });

      window.location.reload(); // 쿠폰 삭제 후 새로고침
    } catch (error) {
      console.error("쿠폰 삭제 실패:", error.response?.data?.error || error.message);
      Swal.fire({
        title: "쿠폰 삭제 실패",
        text: "쿠폰 삭제에 실패했습니다.",
        icon: "error",
        timer: 2500,
      });
    }
  };

  if (!isModalOpen || !selectedCoupon) return null;

  return (
    <CouponForm
      initialData={selectedCoupon}
      onSubmit={handleSubmit}
      onClose={closeModal}
      onDelete={handleDelete}
      isEditMode={true}
    />
  );
};

export default CouponEdit;
