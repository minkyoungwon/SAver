import { Link } from 'react-router-dom';
import logo from "../../public/logo.png"
const Header = ({ user, handleLogout }) => {
  return (
    <header>
      <div className='flex justify-between p-3 items-center'>
        
          <Link to="/"><img src={logo} alt="logo" className='w-30 h-20 border-2 border-black rounded-md'  /></Link>
          
            <nav className='flex justify-end space-x-4 '>
              {/* {!user ? ( */}
                 {!user ? (
                <div>
                    <Link to="/login" className='text-sm mr-4'>로그인</Link>
                    
                </div>
              ) : (
                <div >
                    <Link to="/my-profile" className='text-sm mr-4'>마이페이지</Link>
                    <Link to="/" className='text-sm mr-4' onClick={handleLogout}>로그아웃</Link>
                </div>
              )}
            </nav> 
      </div>
    </header>
  )
}

export default Header