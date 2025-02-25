import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const MyProfile = ({ user }) => {
  console.log("현재 user 객체: ", user);

  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    try {
      const { value: currentPassword } = await Swal.fire({
        title: "현재 비밀번호 입력",
        input: "password",
        inputPlaceholder: "현재 비밀번호를 입력하세요",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonText: "다음",
      });

      if (!currentPassword) return;

      const { value: newPassword } = await Swal.fire({
        title: "새로운 비밀번호 입력",
        input: "password",
        inputPlaceholder: "새로운 비밀번호를 입력하세요 (8자 이상)",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonText: "변경하기",
      });

      if (!newPassword) return;
      if (newPassword.length < 8) {
        Swal.fire({ title: "비밀번호 길이 부족", text: "비밀번호는 최소 8자 이상이어야 합니다.", icon: "warning" });
        return;
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/password/change`,
        { userId: user.id, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      Swal.fire({ title: "비밀번호 변경 완료", text: response.data.message, icon: "success" });
      setMessage("");
    } catch (error) {
      console.error("비밀번호 변경 중 오류:", error);
      Swal.fire({
        title: "비밀번호 변경 실패",
        text: error.response?.data?.message || "비밀번호 변경에 실패했습니다.",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <h2 className="text-3xl font-extrabold text-gray-900">내 프로필</h2>
          <div className="relative group">
            <img
              src={user?.profileImage || "https://via.placeholder.com/150"}
              alt="프로필 이미지"
              className="rounded-full w-40 h-40 object-cover border-4 border-blue-500 transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="w-full space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">이메일:</span> {user?.email || "알 수 없음"}
              </p>
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              비밀번호 변경
            </button>
            {message && (
              <p className="text-center py-2 px-4 rounded-lg bg-red-50 text-red-500">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
