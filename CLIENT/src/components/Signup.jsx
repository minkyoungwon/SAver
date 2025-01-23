import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
const Signup = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // 구글 소셜 로그인 정보 가져오기
  const googleUser = location.state?.googleUser;

  // 일반 회원가입
  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        title: '비밀번호 불일치',
        text: '비밀번호가 일치하지 않습니다. 다시 확인해주세요.',
        icon: 'error',
        timer: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
        email,
        password,
      });
      Swal.fire({
        title: '회원가입 완료',
        text: response.data.message,
        icon: 'success',
        timer: 3000,
      });
      navigate("/email-verification", { state: { email } });
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      const errorMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
      Swal.fire({
        title: '회원가입 실패',
        text: errorMessage,
        icon: 'error',
        timer: 3000,
      });
    }
  };

  // 구글 회원가입
  const handleGoogleSignup = async () => {
    try {
      if (!googleUser) {
        Swal.fire({
          title: '구글 사용자 정보 없음',
          text: '구글 사용자 정보가 없습니다. 다시 시도해주세요.',
          icon: 'error',
          timer: 3000,
        });
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/socialAuth/google-signup-confirm`, {
        email: googleUser.email,
        googleId: googleUser.googleId,
        name: googleUser.name,
        picture: googleUser.picture,
      });

      Swal.fire({
        title: '구글 소셜 회원가입 성공!',
        icon: 'success',
        timer: 3000,
      });
      navigate("/login");
    } catch (error) {
      console.error("구글 소셜 회원가입 중 오류 발생:", error);
      Swal.fire({
        title: '구글 회원가입 실패',
        text: '구글 회원가입에 실패했습니다.',
        icon: 'error',
        timer: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/30 shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">회원가입</h2>

        {/* 일반 회원가입 폼 */}
        {!googleUser && (
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <label className="text-white text-sm ml-1">이메일</label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 focus:border-white/60 focus:outline-none placeholder-gray-500 text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm ml-1">비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 focus:border-white/60 focus:outline-none placeholder-gray-500 text-gray-800"
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
                className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 focus:border-white/60 focus:outline-none placeholder-gray-500 text-gray-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors duration-200"
            >
              가입하기
            </button>
          </form>
        )}

        {/* 구글 소셜 회원가입 버튼 */}
        {googleUser && (
          <div className="text-center">
            <p className="text-white mb-4">구글 계정으로 회원가입</p>
            <button
              onClick={handleGoogleSignup}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors duration-200"
            >
              구글 계정으로 회원가입 완료
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-white">이미 계정이 있으신가요?</p>
          <Link to="/login">
            <button
              className="mt-4 w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 transition-colors duration-200"
            >
              로그인하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
