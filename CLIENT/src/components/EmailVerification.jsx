import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  // 인증 코드 요청
  const handleSendCode = async () => {
    try {
      await axios.post('http://localhost:5000/api/send-verification-code', { email });
      setIsCodeSent(true);
      alert('인증 코드가 이메일로 전송되었습니다.');
    } catch (error) {
      alert('인증 코드 전송에 실패했습니다.');
    }
  };

  // 인증 코드 확인
  const handleVerifyCode = async () => {
	try {
	  await axios.post('http://localhost:5000/api/verify-code', { email, code });
	  alert('이메일 인증이 완료되었습니다.');
	  navigate('/signup', { state: { email } }); // 인증된 이메일과 함께 이동
	} catch (error) {
	  alert('인증 코드가 올바르지 않습니다.');
	}
  };
  

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">이메일 인증</h2>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full border p-2 rounded mb-2"
      />
      {isCodeSent && (
        <input
          type="text"
          placeholder="인증 코드"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          className="w-full border p-2 rounded mb-2"
        />
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
