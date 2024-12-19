import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = posts.find((p) => p.id === Number(id));

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오는 중 오류 발생:', error);
      }
    };
    fetchComments();
  }, [id]);

  if (!post) {
    return <div className="text-center text-red-500">게시글을 찾을 수 없습니다.</div>;
  }

  // 삭제 함수
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`);
      setPosts((prevPosts) => prevPosts.filter((p) => p.id !== Number(id)));
      alert('글이 삭제되었습니다!');
      navigate('/'); // 삭제 후 게시판으로 이동
    } catch (error) {
      console.error('글 삭제 중 오류 발생:', error);
      alert('글 삭제에 실패했습니다.');
    }
  };

  // 댓글 추가 함수
  const handleAddComment = async () => {
    if (newComment.trim() !== '') {
      try {
        const response = await axios.post(`http://localhost:5000/api/comments`, {
          postId: id,
          text: newComment,
        });
        setComments([...comments, response.data]);
        setNewComment('');
        // 밑에 함수 추가로 댓글에 시간 나오게 함함
        setTimeout(()=> {
          window.location.reload();
        }, 10)
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">작성자: {post.author || '익명'}</p>
      <p className="text-sm text-gray-500 mb-6">작성시간: {post.createdAt}</p>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          삭제
        </button>
        <button
          onClick={() => navigate(`/write/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          수정
        </button>
      </div>

      <hr className="mb-6" />

      <h3 className="text-2xl font-semibold mb-4">댓글</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          댓글 작성
        </button>
      </div>

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border border-gray-200 p-4 rounded">
            <p className="text-gray-700">{comment.text}</p>
            <small className="text-gray-500 block mt-2">{new Date(comment.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
