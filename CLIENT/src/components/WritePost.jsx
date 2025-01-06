import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const WritePost = ({ user, setPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();


  useEffect(() => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }
  }, [user, navigate]);


  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
        } catch (error) {
          console.error('게시글을 불러오는 중 오류 발생:', error);
          alert('게시글을 불러오는 데 실패했습니다.');
        }
      }
    };
    fetchPost();
  }, [id]);

  // // 글 작성시 헤더에 올바른 토큰 설정 0101 민경원 추가
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  // 글쓰기 문제가 있어서 로직 변경
  // 0102 mkw fix
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (id) { // 수정 로직
        await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { title, content }, config);
        // 0102 mkw add
        // 기존 posts 상태를 업데이트
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === Number(id) ? { ...post, title, content } : post
          )
        );
        alert('글이 수정되었습니다!');
        navigate(`/post/${id}`); // 수정된 글 상세 페이지로 이동
      }
      if (!id) { // 새로운 게시글 작성 로직
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, { title, content }, config);
        // 새 게시글을 posts에 추가
        setPosts((prevPosts) => [response.data, ...prevPosts]);
        alert('글이 작성되었습니다!');
        navigate(`/post/${response.data.id}`); // 작성된 글 상세 페이지로 이동
        console.log('작성된 글 데이터:', response.data);

      }
      navigate('/');
    } catch (error) {
      console.error('글 저장 중 오류:', error);
      alert('글 저장에 실패했습니다.');
    }
  };
  


  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{id ? '글 수정' : '글쓰기'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-gray-700">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded h-32"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          {id ? '수정 완료' : '작성 완료'}
        </button>
      </form>
    </div>
  );
};

export default WritePost;


