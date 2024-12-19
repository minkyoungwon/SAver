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
        {/* tailwind로 꾸민 부분임 */}
        <Link to="/" className="glitch-btn">게시판</Link>
        <Link to="/coupon" className="glitch-btn">쿠폰 페이지 (test1)</Link>


        <div className='glitch-btn'>
          {user ? <span>{user}님 반갑습니다</span> : <Link to="/login" className="text-blue-0">로그인</Link>}
        </div>

      </div>

      {/* tailwind로 적용 했는데  */}
      {/* <div className="flex justify-between mb-4">
        {user ? <span>{user}님 반갑습니다</span> : <Link to="/login" className="text-blue-500">로그인</Link>}
      </div>
      맘에 안들면 이것으로 바꾸면 됨됨 */}


      <div className="fixed bottom-4 left-4">
        <Link to="/coupon" className="glitch-btn">쿠폰 페이지(test2)</Link>
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
                <Link to={`/post/${post.id}`} className="text-blue-500">{post.title}</Link>
              </td>
              <td className="border border-gray-200 p-2">
                <Link to={`/post/${post.id}`} className="text-blue-500">{post.author}</Link>
              </td>
              <td className="border border-gray-200 p-2 text-center">{post.created_at}</td>
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
            className={`mx-1 px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}

      </div>

      <div className="fixed bottom-4 right-4">
        <Link to="/write" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">글쓰기</Link>
      </div>
    </div>

  );

};

export default Board;
