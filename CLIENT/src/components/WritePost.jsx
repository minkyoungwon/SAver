import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const WritePost = ({ user, setPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!user) {
      Swal.fire({ title: '로그인 필요', text: '로그인이 필요합니다.', icon: 'warning' });
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
          if (response.data) {
            setTitle(response.data.title);
            setContent(response.data.content);
          } else {
            Swal.fire({ title: '게시글 없음', text: '해당 게시글을 찾을 수 없습니다.', icon: 'error' });
            navigate('/');
          }
        } catch (error) {
          Swal.fire({ title: '게시글 불러오기 실패', text: '게시글을 불러오는 데 실패했습니다.', icon: 'error' });
        }
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length < 3 || content.trim().length < 10) {
      Swal.fire({
        title: '입력 부족',
        text: '제목은 최소 3자, 내용은 최소 10자 이상 입력해주세요.',
        icon: 'warning',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (id) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, { title: title.trim(), content: content.trim() }, config);
        setPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === Number(id) ? { ...post, title, content } : post))
        );

        Swal.fire({ title: '글 수정 완료', icon: 'success' });
        navigate(`/post/${id}`);
      } else {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, { title: title.trim(), content: content.trim() }, config);
        setPosts((prevPosts) => [response.data, ...prevPosts]);

        Swal.fire({ title: '글 작성 완료', icon: 'success' });
        navigate(`/post/${response.data.id}`);
      }
    } catch (error) {
      Swal.fire({ title: '글 저장 실패', text: '글 저장에 실패했습니다.', icon: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
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
          {title.length > 0 && title.length < 3 && (
            <p className="text-red-500 text-sm mt-1">제목은 최소 3자 이상이어야 합니다.</p>
          )}
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
          {content.length > 0 && content.length < 10 && (
            <p className="text-red-500 text-sm mt-1">내용은 최소 10자 이상이어야 합니다.</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
          {id ? '수정 완료' : '작성 완료'}
        </button>
      </form>
    </div>
  );
};

export default WritePost;
