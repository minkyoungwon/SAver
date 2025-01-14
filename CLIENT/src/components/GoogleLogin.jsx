import React, { useState } from "react";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

const GoogleLoginFlow = () => {
  const [googleInfo, setGoogleInfo] = useState(null); // 구글 사용자 정보
  const [showConfirm, setShowConfirm] = useState(false); // 가입 동의 화면 여부
  const navigate = useNavigate();

  // 1) 구글 로그인 성공 → 서버에 토큰 검증 + DB확인
  const handleGoogleSuccess = async (res) => {
    try {
      console.log("handleGoogleSuccess response: =>>>>", res); // 여기 찍어보세요
      const { credential } = res;
      const response = await axios.post("/api/socialAuth/google-verify-only", {
        tokenId: credential,
      });

      if (response.data.existingUser) {
        // 이미 가입된 사용자
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        alert("이미 가입된 소셜 계정입니다. 로그인 완료!");
        navigate("/");
      } else {
        // 새 소셜 사용자 => 회원가입 진행
        setGoogleInfo(response.data); 
        setShowConfirm(true);
      }
    } catch (error) {
      console.error("구글 토큰 검증 실패:", error);
      alert("구글 로그인에 실패했습니다.");
    }
  };

  // 2) '가입 동의' 버튼 → 회원가입 진행
  const handleSignupConfirm = async () => {
    if (!googleInfo) return;

    try {
      const response = await axios.post("/api/socialAuth/google-signup-confirm", {
        email: googleInfo.email,
        googleId: googleInfo.googleId,
        name: googleInfo.name,
        picture: googleInfo.picture,
      });

      // 회원가입 성공 시 토큰 저장 후 메인 페이지 이동
      const { token } = response.data;
      localStorage.setItem("token", token);
      alert("구글 회원가입이 완료되었습니다!");
      navigate("/");
    } catch (error) {
      console.error("구글 회원가입 실패:", error);
      alert("구글 회원가입에 실패했습니다.");
    }
  };

  // 3) 구글 로그인 버튼 오류
  const handleGoogleError = () => {
    alert("구글 로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
      {showConfirm && googleInfo && (
        <div>
          <h3>구글 프로필 정보</h3>
          <p>이메일: {googleInfo.email}</p>
          <p>이름: {googleInfo.name}</p>
          <img src={googleInfo.picture} alt="구글 프로필" />
          <button onClick={handleSignupConfirm}>가입 동의</button>
        </div>
      )}
    </div>
  );
};

export default GoogleLoginFlow;
