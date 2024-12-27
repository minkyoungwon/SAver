import { Link } from 'react-router-dom';
const Header = ({ user, handleLogout }) => {
  return (
    <header>
      <div className='flex justify-between p-3 items-center'>
        
          <h1 className='text-2xl justify-center'><Link to="/">세이버</Link></h1>
          
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