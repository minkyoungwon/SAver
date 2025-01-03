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
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">내 프로필</h2>
      <img
        src={user?.profileImage || "https://via.placeholder.com/150"}
        alt="프로필 이미지"
        className="rounded-full w-32 h-32"
      />
      <p className="text-lg">이메일: {user?.email}</p>
      <button
        onClick={handleChangePassword}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        비밀번호 변경
      </button>
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
};

export default MyProfile;
