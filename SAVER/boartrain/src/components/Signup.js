import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const Signup = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/signup', { email, password });
      alert('회원가입이 완료되었습니다!');
      navigate('/login');
    } catch (error) {
      console.log("에러원인 : ", error)
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          value={email}
          readOnly
          className="w-full border p-2 rounded bg-gray-200"
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
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
