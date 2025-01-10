import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import MyProfile from "./pages/MyProfile";
import MyCoupons from "./pages/MyCoupons";
import Intro from "./pages/Intro";
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
  const [email, setEmail] = useState("");
  console.log("유저변경", user);

  const navigate = useNavigate();
  const location = useLocation();

  // 글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("글 목록을 가져오는 중 오류 발생:", error);
      }
    };

    fetchPosts();
  }, []);

  // CLIENT 세션 만료 처리 여부 확인인
  // 0102 mkw add
  useEffect(() => {
    const checkSession = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          setUser(null);
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        }

        // 만료 시간 확인
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          setUser(null);
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
          clearInterval(checkSession);
        }
      } else {
        clearInterval(checkSession);
      }
    }, 10000); // 10초마다 세션 확인
    return () => clearInterval(checkSession); // 컴포넌트 언마운트 시 인터벌 제거
  }, [navigate]);

  // 개인정보 페이지로 이동하는 함수
  const handleProfileClick = () => {
    navigate("/my-profile");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    alert("로그아웃 되었습니다");
    navigate("/");
  };

  const [coupons, setCoupons] = useState([
    {
      id: 1,
      imageSrc: null, // 이미지 URL이 없을 경우 기본 "이미지" 텍스트가 표시됩니다.
      title: "올리브영 50,000원",
      description: "쿠폰 디스크립션 쿠폰 디스크립션 쿠폰 디스크립션 쿠폰 디스크립션 쿠폰 ",
      expiryDate: "2024.12.31",
      category: "카테고리1",
      status: "available",
      // remain: "15,000",
      // used: "35,000",
    },
    {
      id: 2,
      imageSrc: null,
      title: "스타벅스 아메리카노",
      description: "스타벅스 아메리카노 무료 쿠폰 스타벅스 아메리카노 무료 쿠폰스타벅스 아메리카노 ",
      expiryDate: "2024.06.30",
      category: "카테고리2",
      status: "available",
    },
    {
      id: 3,
      imageSrc: null,
      title: "배스킨라빈스 싱글레귤러",
      description: "배스킨라빈스 아이스크림 싱글레귤러 교환권",
      expiryDate: "2024.08.31",
      category: "카테고리1",
      status: "used",
    },
    {
      id: 4,
      imageSrc: null,
      title: "CGV 영화 관람권",
      description: "CGV 2D 일반 영화 관람권",
      expiryDate: "2024.12.31",
      category: "카테고리3",
      status: "expired",
    },
    {
      id: 5,
      imageSrc: null,
      title: "버거킹 와퍼",
      description: "버거킹 와퍼 단품 교환권",
      expiryDate: "2024.09.30",
      category: "카테고리2",
      status: "available",
    },
  ]);

  return (
    <>
      {location.pathname !== "/intro" && location.pathname !== "/login" && location.pathname !== "/signup" && <Header user={user} handleLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={<Home coupons={coupons} setCoupons={setCoupons} />} />
        <Route path="/board" element={<Board posts={posts} user={user} />} />
        <Route path="/write" element={<WritePost user={user} setPosts={setPosts} />} />
        <Route path="/write/:id" element={<WritePost user={user} setPosts={setPosts} />} />
        <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/coupon" element={<Coupon />} /> */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/email-verification" element={<EmailVerification />} />

        <Route path="/my-profile" element={<MyProfile user={user} />} />
        <Route path="/my-coupons" element={<MyCoupons coupons={coupons} />} />
        <Route path="/intro" element={<Intro />} />
      </Routes>
    </>
  );
};

export default App;
