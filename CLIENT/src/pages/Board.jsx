import { useState } from 'react';
import { Link } from 'react-router-dom';

const Board = ({ posts, user }) => {
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 현재 페이지에 표시할 게시글 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  


  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex space-x-1">
        <div className='glitch-btn text-black rounded-md px-4 py-2 shadow hover:bg-green-600 transition rancing-btn'>
          {user ? <span>{user}님 반갑습니다</span> : <Link to="/login" className="text-green-0">로그인</Link>}
        </div>
      </div>

      <button className="relative group overflow-hidden bg-green-500 text-white font-bold py-2 px-6 rounded-lg">
      {user ? <span>{user}님 반갑습니다</span> : <Link to="/login" className="text-green-0">로그인</Link>}
    <span
      className="absolute left-0 top-1 transform -translate-y-1 -translate-x-full group-hover:translate-x-[25%] transition-transform duration-1000 ease-in-out"
    >
      😀
    </span>
    <span
      className="absolute left-0 top-1 transform -translate-y-1 -translate-x-full group-hover:translate-x-[800%] transition-transform duration-1000 ease-in-out"
    >
      😀
    </span>
  </button>




      <div className="fixed bottom-4 left-4">
        <Link to="/coupon" className="glitch-btn text-black rounded-md px-4 py-2 shadow hover:bg-green-600 transition">쿠폰 페이지</Link>
      </div>


      <table className="w-full border-collapse border border-gray-200">

        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2">번호</th>
            <th className="border border-gray-200 p-2">제목</th>
            <th className="border border-gray-200 p-2">이름</th>
            <th className="border border-gray-200 p-2">작성시간</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post, index) => (
            <tr key={post.id} className="hover:bg-gray-50 animate__animated animate__fadeInUp">
              <td className="border border-gray-200 p-2 text-center">{indexOfFirstPost + index + 1}</td>
              <td className="border border-gray-200 p-2">
                <Link to={`/post/${post.id}`} className="text-green-900">{post.title}</Link>
              </td>
              <td className="border border-gray-200 p-2">
                <Link to={`/post/${post.id}`} className="text-green-900">{post.author}</Link>
              </td>
              {/* 시간에 딜레이가 나오는것은 고칠수는 없는데 일단 보류 해둠 0103 mkw */}
              <td className="border border-gray-200 p-2 text-center text-green-700">{post.posted_at}</td>
            </tr>
          ))}
        </tbody>


      </table>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            // className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            className={`mx-0.5 px-3 py-4 rounded ${currentPage === i + 1 ? 'mx-0.5 px-5 py-0.5 bg-green-400 text-white' : 'glitch-btn'}`}
          >
            {i + 1}
          </button>
        ))}

      </div>

      <div className="fixed bottom-4 right-4">
        <Link to="/write" className="glitch-btn text-black rounded-md px-4 py-2 shadow hover:bg-green-600 transition">글쓰기</Link>
      </div>
    </div>

  );

};
export default Board;
