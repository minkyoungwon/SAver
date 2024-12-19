import { Link } from "react-router-dom"
function Home() {
  return (
    <div>
        <nav className="flex justify-center">
          <div className="flex justify-center items-center w-1/2 h-10 bg-gray-200 hover:bg-gray-300 rounded-md">
            <Link to="/board">게시판</Link>
          </div>
          <div className="flex justify-center items-center w-1/2 h-10 bg-gray-200 hover:bg-gray-300 rounded-md">
            <Link to="/coupon">쿠폰</Link>
          </div>
        </nav>
        <div className="flex justify-evenly items-center">
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">사용가능</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">기간만료</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">공유쿠폰</button>
          <button className="w-1/4 h-10 text-gray-600 hover:bg-gray-200 rounded-md">전체쿠폰</button>
        </div>

    </div>
  )
}

export default Home