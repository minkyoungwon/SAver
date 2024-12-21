import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <header>
        <nav className="header-nav">
            <div className="header-logo">
                <Link to="/">
                    {/* <img src="https://www.gametrailers.com/images/logo.png" alt="logo" /> */}
                    <div className='w-20 h-20 bg-[#2176ae]'>logo</div>
                </Link>
            </div>
            <ul className="header-menu flex gap-4 mr-auto">
                <li>
                    <Link to="/">업데이트 소식</Link>
                </li>
                <li>
                    <Link to="/news">뉴스</Link>
                </li>
                <li>
                    <Link to="/community">커뮤니티</Link>
                </li>
                <li>
                    <Link to="/event">이벤트</Link>
                </li>
            </ul>
    </nav>
    </header>
  )
}

export default Header