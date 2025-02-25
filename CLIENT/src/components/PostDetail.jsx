import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const PostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyTargetDepth, setReplyTargetDepth] = useState(0);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const loggedInUserId = parseInt(localStorage.getItem('userId'));

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        Swal.fire({
          title: '게시글 불러오기 실패',
          text: '게시글을 불러오는 데 실패했습니다.',
          icon: 'error',
        });
      }
    };
    fetchPost();
  }, [id]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/posts/comments/${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오기 실패:', error);
      }
    };
    fetchComments();
  }, [id]);

  if (!post) {
    return <div className="text-center text-gray-500">게시글을 불러오는 중...</div>;
  }

  // 게시글 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== Number(id)));
      Swal.fire({
        title: '삭제 완료',
        text: '게시글이 삭제되었습니다!',
        icon: 'success',
      });
      navigate('/');
    } catch (error) {
      Swal.fire({
        title: '삭제 실패',
        text: '게시글 삭제 중 오류가 발생했습니다.',
        icon: 'error',
      });
    }
  };

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/comments`,
        { postId: id, content: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      Swal.fire({ title: '작성 실패', text: '댓글 작성 중 오류 발생', icon: 'error' });
    }
  };

  // 댓글 수정
  const handleSaveEdit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(comments.map((c) => (c.id === commentId ? { ...c, content: editContent } : c)));
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      Swal.fire({ title: '수정 실패', text: '댓글 수정 중 오류 발생', icon: 'error' });
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      Swal.fire({ title: '삭제 실패', text: '댓글 삭제 중 오류 발생', icon: 'error' });
    }
  };

  // 대댓글 달기
  const handleReplyClick = (commentId, commentDepth) => {
    setReplyTargetId(commentId);
    setReplyTargetDepth(commentDepth + 1);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/reply`,
        { postId: id, content: replyContent, parentId: replyTargetId, depth: replyTargetDepth },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, response.data]);
      setReplyContent('');
      setReplyTargetId(null);
      setReplyTargetDepth(0);
    } catch (error) {
      Swal.fire({ title: '대댓글 작성 실패', text: '오류가 발생했습니다.', icon: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-right text-sm text-gray-500">작성자: {post.author || '익명'}</p>
      <p className="text-right text-sm text-gray-500">조회수: {post.view_count}</p>

      {post.user_id === loggedInUserId && (
        <div className="flex justify-end space-x-2">
          <button onClick={() => navigate(`/write/${id}`)} className="bg-blue-500 text-white px-4 py-2 rounded">
            수정
          </button>
          <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">
            삭제
          </button>
        </div>
      )}

      <h3 className="text-2xl font-semibold mt-6">댓글</h3>
      <input
        type="text"
        placeholder="댓글 입력"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button onClick={handleAddComment} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        작성
      </button>

      <ul className="space-y-4 mt-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border-l pl-4">
            <p>{comment.content}</p>
            <small className="text-gray-500">작성자: {comment.user_email || '익명'}</small>
            {comment.user_id === loggedInUserId && (
              <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 ml-2">
                삭제
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostDetail;
