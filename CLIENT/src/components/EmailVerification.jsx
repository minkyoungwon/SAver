// EmailVerification.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const location = useLocation();
  const email = location.state?.email;
  const navigate = useNavigate();

  console.log("EmailVerification 컴포넌트에서 받은 email:", email);

  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(600); // 10분 (600초)
  const [errorMessage, setErrorMessage] = useState(null);

  // [신규 주석] 컴포넌트 마운트 시, 만약 email이 없다면 그냥 에러 처리 또는 페이지 이동
  useEffect(() => {
    if (!email) {
      alert("이메일 정보가 없습니다. 회원가입 후 이 페이지를 여세요.");
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (isCodeSent && timer > 0) {
      // [기존 주석] 타이머 동작
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      // [신규 주석] 10분 초과 시
      setIsCodeSent(false);
      setErrorMessage("인증 코드가 만료되었습니다. 다시 요청해주세요.");
    }
    return () => clearInterval(interval);
  }, [isCodeSent, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  // [인증 코드 요청 버튼 클릭]
  const handleSendCode = async () => {
    try {
      console.log("전송할 email:", email);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/send-verification-code`, { email });
      setIsCodeSent(true);
      setTimer(600); // 10분 리셋
      setErrorMessage(null);
      alert("인증 코드가 이메일로 전송되었습니다. 10분 안에 입력해주세요.");
    } catch (error) {
      console.error("인증 코드 전송 중 오류:", error.response?.data?.message || error.message);
      setErrorMessage("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // [인증 코드 확인 버튼 클릭]
  const handleVerifyCode = async () => {
    // [신규 주석] 프론트에서 타이머 체크도 하되, 서버에서도 코드 만료되면 유저 삭제됨
    if (timer <= 0) {
      setErrorMessage("인증 코드가 만료되었습니다. 다시 요청해주세요.");
      return;
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-code`, {
        email,
        code,
      });

      // 검증 성공
      alert("이메일 인증이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login", { state: { email } });
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.error("이메일 인증 중 오류:", msg);
      setErrorMessage(msg);
    }
  };



  return (
    <div className="max-w-md mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">이메일 인증</h3>

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

      {isCodeSent && (
        <>
          <p className="mb-2 text-gray-700">남은 시간: {formatTime(timer)}</p>
          <input
            type="text"
            placeholder="인증 코드 입력"
            value={code}
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setCode(e.target.value); // 숫자만 입력
            }}
            maxLength={6}
            required
            className="w-full border p-2 rounded mb-2"
          />
        </>
      )}

      {!isCodeSent ? (
        <button onClick={handleSendCode} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          인증 코드 보내기
        </button>
      ) : (
        <button
          onClick={handleVerifyCode}
          disabled={timer <= 0}
          className="bg-green-500 text-white px-4 py-2 rounded w-full"
        >
          인증 코드 확인
        </button>
      )}


      {errorMessage === "인증 코드가 존재하지 않습니다. 인증 코드를 다시 요청하세요." && (
        <button onClick={handleSendCode} className="bg-red-500 text-white px-4 py-2 rounded w-full mt-2">
          인증 코드 다시 요청
        </button>
      )}

    </div>
  );
};

export default EmailVerification;
