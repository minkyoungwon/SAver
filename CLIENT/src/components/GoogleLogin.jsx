import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const GoogleLoginFlow = () => {
  const [googleInfo, setGoogleInfo] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // 1) 구글 로그인 성공 → 서버에 토큰 검증 + DB확인
  const handleGoogleSuccess = async (res) => {
    try {
      console.log("handleGoogleSuccess response:", res);
      const { credential } = res;

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/socialAuth/google-verify-only`, {
        tokenId: credential,
      });

      if (response.data.existingUser) {
        // 이미 가입된 사용자 → 로그인 처리
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userEmail", user.email);

        Swal.fire({
          title: "로그인 완료",
          text: "이미 가입된 소셜 계정입니다.",
          icon: "success",
        });

        navigate("/");
      } else {
        // 새 소셜 사용자 → 회원가입 진행
        setGoogleInfo(response.data);
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("구글 토큰 검증 실패:", error.response?.data?.error || error.message);
      Swal.fire({
        title: "로그인 실패",
        text: "구글 로그인에 실패했습니다.",
        icon: "error",
      });
    }
  };

  // 2) '가입 동의' 버튼 → 회원가입 진행
  const handleSignupConfirm = async () => {
    if (!googleInfo) return;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/socialAuth/google-signup-confirm`, {
        email: googleInfo.email,
        googleId: googleInfo.googleId,
        name: googleInfo.name,
        picture: googleInfo.picture,
      });

      // 회원가입 성공 시 토큰 저장 후 자동 로그인 처리
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);

      Swal.fire({
        title: "회원가입 완료",
        text: "구글 회원가입이 완료되었습니다!",
        icon: "success",
      });

      navigate("/");
    } catch (error) {
      console.error("구글 회원가입 실패:", error.response?.data?.error || error.message);
      Swal.fire({
        title: "회원가입 실패",
        text: "구글 회원가입에 실패했습니다.",
        icon: "error",
      });
    }
  };

  // 3) 구글 로그인 버튼 오류
  const handleGoogleError = () => {
    Swal.fire({
      title: "로그인 실패",
      text: "구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.",
      icon: "error",
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

      {showConfirm && googleInfo && (
        <div className="p-4 border rounded-lg shadow-md w-80 bg-white text-center">
          <h3 className="text-lg font-semibold mb-2">구글 프로필 정보</h3>
          <img src={googleInfo.picture} alt="구글 프로필" className="w-16 h-16 rounded-full mx-auto mb-2" />
          <p className="text-sm text-gray-700">이메일: {googleInfo.email}</p>
          <p className="text-sm text-gray-700">이름: {googleInfo.name}</p>
          <button
            onClick={handleSignupConfirm}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md w-full"
          >
            가입 동의
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginFlow;
