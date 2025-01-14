import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 일반 로그인
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email, password }
      );
      const { token } = response.data;

      localStorage.setItem("token", token);

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userEmail = decodedToken.email;
      localStorage.setItem("userId", decodedToken.id);
      localStorage.setItem("userEmail", userEmail);
      setUser({ email: userEmail, id: decodedToken.id });

      alert("로그인 성공!");
      navigate("/");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    } catch (error) {
      console.error("로그인 중 오류:", error);
      alert("로그인에 실패하였습니다. 아이디 혹은 비밀번호를 확인해주세요.");
    }
  };

  // 구글 로그인 성공 처리
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/socialAuth/google-verify-only`,
        { tokenId: credential }
      );

      if (response.data.existingUser) {
        const { token, user } = response.data;
        localStorage.setItem("token", token);
        setUser(user);
        alert("구글 로그인 성공!");
        navigate("/");
      } else {
        alert("새 소셜 사용자입니다. 회원가입이 필요합니다.");
        navigate("/signup", {
          state: {
            googleUser: {
              email: response.data.email,
              googleId: response.data.googleId,
              name: response.data.name,
              picture: response.data.picture,
            },
          },
        });
      }
    } catch (error) {
      console.error("구글 로그인 처리 중 오류:", error);
      alert("구글 로그인에 실패했습니다.");
    }
  };

  // 구글 로그인 실패 처리
  const handleGoogleFailure = (error) => {
    console.error("구글 로그인 실패:", error);
    alert("구글 로그인에 실패했습니다. 다시 시도해주세요.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-400 p-4">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/30 shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-white text-center">로그인</h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 focus:border-white/60 focus:outline-none placeholder-gray-500 text-gray-800"
            />
          </div>
          <div className="space-y-2">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/30 focus:border-white/60 focus:outline-none placeholder-gray-500 text-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-white mb-4">아이디가 없으신가요?</p>
          <Link to="/signup">
            <button
              type="button"
              className="w-full py-3 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold border border-white/30 transition-colors"
            >
              회원가입
            </button>
          </Link>
        </div>

        {/* 구글 로그인 */}
        <div className="mt-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
