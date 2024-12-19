import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      try {
        await axios.get(`http://localhost:5000/api/verify-email?token=${token}`);
        alert('이메일 인증이 완료되었습니다!');
        navigate('/login');
      } catch (error) {
        console.error('이메일 인증 중 오류:', error);
        alert('이메일 인증에 실패하였습니다.');
      }
    };

    verifyEmail();
  }, [navigate, searchParams]);

  return (
	<div className="text-center">
	  <h2 className="text-2xl font-bold mb-4">이메일 인증 중...</h2>
	  <p className="text-gray-600">잠시만 기다려 주세요. 인증이 완료되면 자동으로 로그인 페이지로 이동합니다.</p>
	</div>
  );
}

export default VerifyEmail;
