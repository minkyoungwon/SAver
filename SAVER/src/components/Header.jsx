import { Link } from 'react-router-dom';
import './main.css';
const Header = () => {
  return (
    <header>
          <h1 className='text-lg bg-red-700 inline-block w-[100px] h-96'>세이버</h1>
            <nav className='flex justify-center space-x-4'>
                    <Link to="/" className=''>회원가입</Link>
                    <Link to="/" className='text-sm mr-4'>로그인</Link>
                    <Link to="/" className='text-sm mr-4'>로그아웃</Link>
            </nav> 
            
    </header>
  )
}

export default Header