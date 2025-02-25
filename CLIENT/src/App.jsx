import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import WritePost from "./components/WritePost";
import PostDetail from "./components/PostDetail";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import VerifyEmail from "./components/VerifyEmail";
import EmailVerification from "./components/EmailVerification";
import Board from "./pages/Board";
import Header from "./components/Header";
import Home from "./pages/Home";
import MyProfile from "./pages/MyProfile";
import MyCoupons from "./pages/MyCoupons";
import Intro from "./pages/Intro";
import Dm from "./components/Dm";
import Swal from "sweetalert2";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ModalProvider } from "./context/ModalContext";
import CouponDetail from "./components/coupon/CouponDetail";

const App = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigate = useNavigate();
  const location = useLocation();

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
  const [coupons, setCoupons] = useState([]);

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

  // 세션 만료 확인 및 자동 로그아웃
  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Math.floor(Date.now() / 1000);

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem("token");
          localStorage.removeItem("userEmail");
          setUser(null);
          Swal.fire({ title: "세션 만료", text: "세션이 만료되었습니다. 다시 로그인해주세요.", icon: "error" });
          navigate("/login");
        } else {
          setTimeout(checkSession, (decodedToken.exp - currentTime) * 1000);
        }
      } catch (error) {
        console.error("세션 확인 중 오류 발생:", error);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    Swal.fire({ title: "로그아웃", text: "로그아웃 되었습니다", icon: "success" });
    navigate("/");
  };

  return (
    <ModalProvider>
      <GoogleOAuthProvider clientId={clientId}>
        {location.pathname !== "/intro" &&
          location.pathname !== "/login" &&
          location.pathname !== "/signup" && <Header user={user} handleLogout={handleLogout} />}
        <Routes>
          <Route path="/" element={<Home coupons={coupons} setCoupons={setCoupons} />} />
          <Route path="/board" element={<Board posts={posts} user={user} />} />
          <Route path="/write" element={<WritePost user={user} setPosts={setPosts} />} />
          <Route path="/write/:id" element={<WritePost user={user} setPosts={setPosts} />} />
          <Route path="/post/:id" element={<PostDetail posts={posts} setPosts={setPosts} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/my-profile" element={<MyProfile user={user} />} />
          <Route path="/my-coupons" element={<MyCoupons coupons={coupons} />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/dm" element={<Dm />} />
        </Routes>
        {location.pathname === "/my-coupons" && <CouponDetail />}
      </GoogleOAuthProvider>
    </ModalProvider>
  );
};

export default App;
