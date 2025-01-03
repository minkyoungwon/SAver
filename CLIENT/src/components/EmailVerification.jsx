import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation 추가

const EmailVerification = () => {
  const location = useLocation(); // 부모로부터 전달된 state 확인을 위한 useLocation
  const email = location.state?.email; // 전달받은 email 값 추출

  console.log("EmailVerification 컴포넌트에서 받은 email:", email); // email 값 로그 출력

  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timer, setTimer] = useState(600); // 10분 (600초)
  const navigate = useNavigate();

  useEffect(() => {
    if (isCodeSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCodeSent, timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleSendCode = async () => {
    try {
      console.log("전송할 email:", email); // email 값 확인
      await axios.post('http://localhost:5000/api/auth/send-verification-code', { email });
      setIsCodeSent(true);
      setTimer(600); // 타이머 리셋
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      console.error("인증 코드 전송 중 오류:", error);
      alert('인증 코드 전송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async () => {
    if (timer <= 0) {
      alert('인증 코드가 만료되었습니다. 다시 요청해주세요.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/verify-code', { email, code });
      alert('이메일 인증이 완료되었습니다.');
      navigate('/login', { state: { email } });
    } catch (error) {
      alert('인증 코드가 올바르지 않습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h3 className="text-2xl font-bold mb-4">이메일 인증</h3>
      {isCodeSent && (
        <>
          <p className="mb-2">남은 시간: {formatTime(timer)}</p>
          <input
            type="text"
            placeholder="인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border p-2 rounded mb-2"
          />
        </>
      )}
      {!isCodeSent ? (
        <button onClick={handleSendCode} className="bg-blue-500 text-white px-4 py-2 rounded">
          인증 코드 보내기
        </button>
      ) : (
        <button onClick={handleVerifyCode} className="bg-green-500 text-white px-4 py-2 rounded">
          인증 코드 확인
        </button>
      )}
    </div>
  );
};

export default EmailVerification;
