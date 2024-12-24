import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import WritePost from "./components/WritePost";
import PostDetail from "./components/PostDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
// import Footer from "./components/Footer";
import Profile from "./components/Profile";
import VerifyEmail from "./components/VerifyEmail";
import EmailVerification from "./components/EmailVerification";
import Board from "./pages/Board";
import Header from "./components/Header";
import Home from "./pages/Home";

const App = () => {
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.email.split("@")[0];
      } catch (error) {
        console.error("토큰 디코딩 중 오류 발생:", error);
      }
    }
    return null;
  };

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(getUserFromToken());
  console.log(user);

  const navigate = useNavigate();

  // 글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("글 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchPosts();
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("로그아웃 되었습니다");
    navigate("/");
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
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
  // 개인정보 페이지로 이동하는 함수
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
    <Header user={user} handleLogout={handleLogout} handleLogin={handleLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board posts={posts} user={user} />} />
        <Route
          path="/write"
          element={<WritePost user={user} setPosts={setPosts} />}
        />
        <Route
          path="/write/:id"
          element={<WritePost user={user} setPosts={setPosts} />}
        />
        <Route
          path="/post/:id"
          element={<PostDetail posts={posts} setPosts={setPosts} />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/coupon" element={<Coupon />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-verification" element={<EmailVerification />} />
      </Routes>

      {user && (
        <div className="fixed top-4 right-4 space-x-2">
          <button
            onClick={handleProfileClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            개인정보
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </div>
      )}

      {/* <Footer /> */}
    </>
  );
};

export default App;
