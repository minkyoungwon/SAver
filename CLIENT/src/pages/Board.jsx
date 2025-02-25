import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Swal from "sweetalert2";

const Board = ({ posts, user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // 검색 핸들러
  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length < 2) {
      Swal.fire({ title: "검색어 입력 부족", text: "검색어는 최소 2자 이상 입력해주세요.", icon: "warning" });
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search?query=${encodeURIComponent(trimmedQuery)}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setSearchResults(data);
      setIsSearching(true);
      setCurrentPage(1);
    } catch (error) {
      Swal.fire({ title: "검색 오류", text: "검색 중 오류가 발생했습니다.", icon: "error" });
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const displayedPosts = isSearching ? searchResults : posts;
  const currentPosts = displayedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(displayedPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col overflow-auto">
      <div className="flex-grow content-wrapper">
        {/* 검색 입력 */}
        <div className="flex justify-end mt-24 mb-8">
          <form onSubmit={handleSearch} className="flex space-x-2">
            <input
              type="text"
              placeholder="검색어를 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[356px] h-full px-4 border rounded-full"
            />
            <button type="submit" className="bg-emerald-500 text-white px-4 py-2 rounded-full hover:bg-emerald-600">
              검색하기
            </button>
          </form>
        </div>

        {/* 게시글 작성 버튼 */}
        <div className="flex justify-start mb-2">
          {user && (
            <Link to="/write" className="px-4 py-1 rounded-sm border bg-gray-100 hover:bg-emerald-500 hover:text-white transition">
              게시글 작성하기
            </Link>
          )}
        </div>

        {/* 게시글 목록 */}
        <div className="테이블부">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 p-2 w-12 text-center">번호</th>
                <th className="border border-gray-200 p-2 text-center">제목</th>
                <th className="border border-gray-200 p-2 w-20 text-center">이름</th>
                <th className="border border-gray-200 p-2 w-44 text-center">작성시간</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length > 0 ? (
                currentPosts.map((post, index) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2 text-center">{indexOfFirstPost + index + 1}</td>
                    <td className="border border-gray-200 p-2">
                      <Link to={`/post/${post.id}`} className="text-green-900 hover:underline">
                        {post.title}
                      </Link>
                    </td>
                    <td className="border border-gray-200 p-2 text-center">{post.author || "익명"}</td>
                    <td className="border border-gray-200 p-2 text-center text-green-900">
                      {new Date(post.posted_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="border border-gray-200 p-4 text-center text-gray-500">
                    {isSearching ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`mx-2 px-3 py-1 rounded-lg transition ${
                  currentPage === i + 1 ? "bg-emerald-500 text-white" : "bg-gray-100 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Board;
