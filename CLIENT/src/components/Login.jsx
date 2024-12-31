import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  // Link 추가


const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      setUser(email);
      alert('로그인 성공!');
      navigate('/');
      setTimeout(() => {
        window.location.reload()
      }, 10);
    } catch (error) {
      console.error('로그인 중 오류:', error);
      alert('로그인에 실패하였습니다. 아이디 혹은 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">로그인</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          로그인
        </button>

        <h2 className="text-lg mt-4">아이디가 없으신가요?</h2>
        <Link to="/signup">
  <button type="button" className="bg-green-500 text-white px-4 py-2 rounded">
    회원가입
  </button>
</Link>
      </form>
    </div>
  );
};

export default Login;
