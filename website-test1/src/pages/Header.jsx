import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
const Header = () => {
    const isLogin = useContext(AuthContext);
    return (
        <header>
            <nav className="header-nav">
                <div className="header-logo">
                    <Link to="/">
                        {/* <img src="https://www.gametrailers.com/images/logo.png" alt="logo" /> */}
                        <div className="w-20 h-20 bg-[#2176ae]">logo</div>
                    </Link>
                </div>
                <ul className="header-menu flex gap-4 mr-auto">
                    <li>
                        <Link to="update-news">업데이트 소식</Link>
                    </li>
                    <li>
                        <Link to="/">뉴스</Link>
                    </li>
                    <li>
                        <Link to="/board">커뮤니티</Link>
                    </li>
                    <li>
                        <Link to="/event">이벤트</Link>
                    </li>
                </ul>
                <div className="header-login p-2 bg-[#2176ae] rounded-md">
                    {isLogin ? (
                        <Link to="/logout">로그아웃</Link>
                    ) : (
                        <Link to="/login">로그인</Link>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
