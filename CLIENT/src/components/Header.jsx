import { Link } from "react-router-dom";
import logo from "/src/assets/logo.png";
import logo2 from "/src/assets/logo2.svg";
import logo3 from "/src/assets/logo3.svg";

const Header = ({ user, handleLogout }) => {
  return (
    <div className="content-wrapper sticky top-0 z-10 ">
      <header>

        <div className="py-4 px-[16px] md:px-[15%] text-lg w-full flex justify-between items-center text-emerald-600 bg-white">

          <nav className="flex justify-center items-center">
            <Link to="/">
              <img src={logo3} alt="logo" className=" mr-6 w-30 h-8 pb-1 rounded-md" />
            </Link>
            <Link to="/">
              <div className=" pr-6 hover: ">쿠폰</div>
            </Link>
            <Link to="/board">
              <div className=" pr-6 hover: ">게시판</div>
            </Link>
          </nav>
          <nav className="flex justify-end space-x-4">
            {user ? (
              <>
                <Link to="/dm" className="text-sm">
                  DM
                </Link>
                <Link to="/my-profile" className="text-sm">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="text-sm">
                  로그아웃
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm">

                로그인
              </Link>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
