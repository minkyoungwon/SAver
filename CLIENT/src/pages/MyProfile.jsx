import { useState } from "react";
import axios from "axios";

const MyProfile = ({ user }) => {
  // MyProfile.jsx 예시
console.log("현재 user 객체: ", user);

  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    try {
      const currentPassword = prompt("현재 비밀번호를 입력하세요:");
      if (!currentPassword) {
        alert("현재 비밀번호를 입력하지 않았습니다.");
        return;
      }

      const newPassword = prompt("새로운 비밀번호를 입력하세요:");
      if (!newPassword) {
        alert("새로운 비밀번호를 입력하지 않았습니다.");
        return;
      }

      console.log("입력된 현재 비밀번호:", currentPassword); // 디버깅 추가
      console.log("입력된 새 비밀번호:", newPassword); // 디버깅 추가




      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/password/change`,
        {
          userId: user.id,
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("서버 응답:", response.data); // 디버깅 추가
      setMessage(response.data.message);
    } catch (error) {
      console.error("비밀번호 변경 중 오류:", error);
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("비밀번호 변경에 실패했습니다.");
      }
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
                <span className="font-semibold">이메일:</span> {user?.email}
              </p>
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              비밀번호 변경
            </button>
            {message && (
              <p className="text-center py-2 px-4 rounded-lg bg-red-50 text-red-500">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
