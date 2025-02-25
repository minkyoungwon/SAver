import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Signup = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const googleUser = location.state?.googleUser;

  // 일반 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password.trim() !== confirmPassword.trim()) {
      Swal.fire({ title: '비밀번호 불일치', text: '비밀번호가 일치하지 않습니다.', icon: 'error' });
      return;
    }

    if (password.trim().length < 8) {
      Swal.fire({ title: '비밀번호 길이 부족', text: '비밀번호는 최소 8자 이상이어야 합니다.', icon: 'error' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        email: email.trim(),
        password: password.trim(),
      });

      Swal.fire({ title: '회원가입 완료', text: response.data.message, icon: 'success' });

      navigate('/email-verification', { state: { email } });
    } catch (error) {
      console.error('회원가입 오류:', error.response?.data?.error || error.message);
      Swal.fire({ title: '회원가입 실패', text: '이미 존재하는 이메일입니다.', icon: 'error' });
    }
  };

  // 구글 회원가입
  const handleGoogleSignup = async () => {
    if (!googleUser) {
      Swal.fire({ title: '구글 사용자 정보 없음', text: '구글 사용자 정보가 없습니다.', icon: 'error' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/socialAuth/google-signup-confirm`, {
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name,
        picture: googleUser.picture,
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userEmail', user.email);

      Swal.fire({ title: '구글 회원가입 성공!', icon: 'success' });
      navigate('/');
    } catch (error) {
      console.error('구글 회원가입 오류:', error.response?.data?.error || error.message);
      Swal.fire({ title: '구글 회원가입 실패', text: '회원가입에 실패했습니다.', icon: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/30 shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">회원가입</h2>

        {!googleUser && (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white text-sm ml-1">이메일</label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 placeholder-gray-500 text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm ml-1">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호 (8자 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 placeholder-gray-500 text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm ml-1">비밀번호 확인</label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 placeholder-gray-500 text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              가입하기
            </button>
          </form>
        )}

        {googleUser && (
          <div className="text-center">
            <p className="text-white mb-4">구글 계정으로 회원가입</p>
            <button
              onClick={handleGoogleSignup}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold"
            >
              구글 계정으로 회원가입 완료
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-white">이미 계정이 있으신가요?</p>
          <Link to="/login">
            <button className="mt-4 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30">
              로그인하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
