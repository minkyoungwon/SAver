import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';


const Signup = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 추가 // add 0102 mkw



  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }
    // 바뀐 로직
    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        email,
        password,
      });
      alert(response.data.message);
      
      // 이메일 인증 화면으로 이동 // 0102 mkw add
      //navigate("/email-verification", {state: {email: response.data.email}})
      navigate("/email-verification", { state: {email} })
    } catch (error) {
      console.error("회원가입 중 오류:", error);

      //서버에서 받은 에러 메시지 출력
      const errorMessage = error.response?.data?.message || "회원가입에 실패했습니다.";
      alert(errorMessage);
    }
  };


    // 기존로직
  //   try {
  //     await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, { email, password }); //api/auth/signup 에서 auth 추가 - 0102 mkw add
  //     alert('회원가입이 완료되었습니다!');
  //     navigate('/');

  //   } catch (error) {
  //     console.log("에러원인 : ", error)
  //     alert('회원가입 중 오류가 발생했습니다.');
  //   }
  // };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">회원가입</h2>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded "
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        {/* 비밀번호 확인 칸 추가 // add 0102 mkw */}
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword} // 비밀번호 확인 입력
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button type="submit" className={`signup-btn px-4 py-2 rounded `}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Signup;
