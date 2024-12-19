import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const WritePost = ({ user, setPosts }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/posts/${id}`, { title, content });
        alert('글이 수정되었습니다!');
        window.location.reload();
      } else {
        const response = await axios.post('http://localhost:5000/api/posts', { title, content, author: user || '익명' });
        setPosts((prevPosts) => [response.data, ...prevPosts]);
        alert('글이 작성되었습니다!');
        // 작성시간이 안나오는 부분을 0.1초 리로드하는것으로 고침
        setTimeout(() => { 
          window.location.reload();
        }, 10);;
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


