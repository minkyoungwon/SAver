import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Board = ({ posts, user }) => {
  // 페이지네이션 관련 상태
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) {
      setIsSearching(false);
      return;
    }
    try {
      // fetch를 사용하여 GET 요청
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search?query=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // 토큰 추가
        },
      });

      // 응답 처리
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setSearchResults(data); // 검색 결과 업데이트
      setIsSearching(true); // 검색 모드 활성화
      setCurrentPage(1); // 페이지 초기화
    } catch (error) {
      console.error("검색 오류:", error);
      alert("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 현재 페이지 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // 검색 여부에 따른 게시글 데이터 결정
  const displayedPosts = isSearching ? searchResults : posts;
  const currentPosts = displayedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayedPosts.length / postsPerPage);

  // 페이지 변경 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col overflow-auto no-scrollbar">
      {/* 상단에 검색 폼 추가 */}
      <div className="flex-grow content-wrapper">
        <div className="검색부 flex justify-end mt-24 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input type="text" placeholder="검색어를 입력하세요..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex w-[356px] h-full px-4 border rounded-full" />
            <button className="btn-primary-r w-[90px]">검색하기</button>
          </form>
        </div>

        <div className="테이블부">
          <div className="flex justify-start mb-2">
            <Link to="/write" className="flex px-4 py-1 rounded-sm border bg-gray-100 hover:bg-emerald-500 hover:text-white transition">
              게시글 작성하기
            </Link>
          </div>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 w-12 text-center">번호</th>
                <th className="border border-gray-200 p-2  text-center">제목</th>
                <th className="border border-gray-200 p-2 w-20 text-center">이름</th>
                <th className="border border-gray-200 p-2 w-44 text-center">작성시간</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <tr key={post.id} className="hover:bg-gray-50 animate__animated animate__fadeInUp">
                  <td className="border border-gray-200 p-2 text-center">{indexOfFirstPost + index + 1}</td>
                  <td className="border border-gray-200 p-2">
                    <Link to={`/post/${post.id}`} className="text-green-900">
                      {post.title}
                    </Link>
                  </td>
                  <td className="border border-gray-200 p-2">
                    <Link to={`/post/${post.id}`} className="text-green-900">
                      {post.author}
                    </Link>
                  </td>
                  <td className="border border-gray-200 p-2 text-center text-green-900">{post.posted_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="하단부 flex grid-flow-col mt-4 bg-white">
          {/* 페이지네이션 */}
          <div className="flex justify-center w-full  bg-white">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)}
                className={`mx-3  ${currentPage === i + 1 ? "mx-3 text-emerald-400" : " mx-3 "}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Board;

{/* <div className="flex space-x-1">
        <div className="glitch-btn text-black rounded-md px-4 py-2 shadow hover:bg-green-600 transition rancing-btn">
        {user ? (
          <span>{user}님 반갑습니다</span>
          ) : (
            <Link to="/login" className="text-green-0">
            로그인
            </Link>
            )}
            </div>
            </div> */}
{/* <button className="relative group overflow-hidden bg-green-500 text-white font-bold py-2 px-6 rounded-lg">
        {user ? (
          <span>{user}님 반갑습니다</span>
          ) : (
            <Link to="/login" className="text-green-0">
            로그인
            </Link>
            )}
            <span className="absolute left-0 top-1 transform -translate-y-1 -translate-x-full group-hover:translate-x-[25%] transition-transform duration-1000 ease-in-out">😀</span>
            <span className="absolute left-0 top-1 transform -translate-y-1 -translate-x-full group-hover:translate-x-[800%] transition-transform duration-1000 ease-in-out">😀</span>
            </button> */}