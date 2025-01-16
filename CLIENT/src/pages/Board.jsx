import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import UiComponents from "../components/uiComponents";

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
    <div>
      {/* <UiComponents /> */}
      {/* 상단에 검색 폼 추가 */}
      <div className="content-wrapper">
        <div className="검색부 flex justify-end space-x-2 mt-12 mb-4 bg-red-200">
          <form onSubmit={handleSearch} className="w-full md:w-[460px] flex items-center">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex w-full h-full px-4 border rounded-full"
            />
            <button type="submit" className="btn-primary-r ml-2">검색하기</button>
          </form>
        </div>
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
        <div className="테이블 bg-gray-200 ">
          <table className="w-full border-collapse border min-h-[500px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 ">번호</th>
                <th className="border border-gray-200 p-2 ">제목</th>
                <th className="border border-gray-200 p-2 ">이름</th>
                <th className="border border-gray-200 p-2 ">작성시간</th>
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
                  <td className="border border-gray-200 p-2 text-center text-green-700">{post.posted_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="하단부 flex-row my-4 bg-red-200">
          {/* 페이지네이션 */}
          <div className="flex justify-center bg-amber-100">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => paginate(i + 1)} className={`mx-0.5 px-3 py-4 rounded ${currentPage === i + 1 ? "mx-0.5 px-5 py-0.5 bg-green-400 text-white" : "glitch-btn"}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-end ">
            <Link to="/write" className="flex btn-primary-r justify-center">
              글쓰기
            </Link>
          </div>
          {/* <div className="fixed bottom-4 right-4">
            <Link to="/write" className="glitch-btn text-black rounded-md px-4 py-2 shadow hover:bg-green-600 transition">
              글쓰기
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Board;
