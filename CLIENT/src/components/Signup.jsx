import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';


const Signup = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });
      alert(response.data.message);
      navigate("/email-verification", { state: {email} })
    } catch (error) {
      console.error("회원가입 중 오류:", error);
      const errorMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/30 shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">회원가입</h2>
        
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
