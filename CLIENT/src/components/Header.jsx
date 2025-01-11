import { Link } from "react-router-dom";
import logo from "/src/assets/logo.png";

const Header = ({ user, handleLogout }) => {
  return (
    <header>
      <div className="m-0 px-[10%] py-4 w-full flex justify-between  items-center">
        <nav className="flex justify-center items-center">
          <Link to="/">
            <img src={logo} alt="logo" className=" mr-6 w-30 h-8  border-2 border-black rounded-md" />
          </Link>
          <Link to="/my-coupons">
            <div className=" pr-6 hover: ">쿠폰</div>
          </Link>
          <Link to="/board">
            <div className=" pr-6 hover: ">게시판</div>
          </Link>
        </nav>
        <nav className="flex justify-end space-x-4">
          {user ? (
            <>
              <Link to="/my-profile" className="text-sm mr-4">
                마이페이지
              </Link>
              <Link to="/dm" className="test-sm mr-4">
              DM 칸
              </Link>
              <button onClick={handleLogout} className="text-sm mr-4">
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm mr-4">
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
