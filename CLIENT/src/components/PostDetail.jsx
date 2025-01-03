import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ posts, setPosts }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 게시글 찾기
  const post = posts.find((p) => p.id === Number(id));

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // 대댓글 상태
  const [replyContent, setReplyContent] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);
  const [replyTargetDepth, setReplyTargetDepth] = useState(0);

  // 수정 모드 상태
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // 로그인된 사용자 이메일 (로그인 시 localStorage.setItem('userEmail', "xxx@xxx.com") 했다고 가정)
  const loggedInUserEmail = localStorage.getItem('userEmail') || '';
  // console.log("이거확인",loggedInUserEmail)
  // console.log('userEmail')

  // 잘 오는지 디버깅
  useEffect(() => {
    console.log('Logged in user email:', loggedInUserEmail);
  }, [loggedInUserEmail]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/posts/comments/${id}`
        );
        setComments(response.data);
      } catch (error) {
        console.error('댓글 불러오는 중 오류 발생:', error);
      }
    };
    fetchComments();
  }, [id]);

  // 게시글이 없으면 에러 표시
  if (!post) {
    return <div className="text-center text-red-500">게시글을 찾을 수 없습니다.</div>;
  }

  // 게시글 삭제 함수
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== Number(id)));
      alert('글이 삭제되었습니다!');
      navigate('/');
    } catch (error) {
      console.error('글 삭제 중 오류 발생:', error);
      alert('글 삭제에 실패했습니다.');
    }
  };

  // 댓글 작성 함수
  const handleAddComment = async () => {
    if (newComment.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/comments`,
          { postId: id, content: newComment },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments((prev) => [...prev, response.data]);
        setNewComment('');
        setTimeout(() => {
          window.location.reload();
        }, 10);
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
        alert(error.response?.data?.message || '댓글 작성 중 오류가 발생했습니다.');
      }
    }
  };

  // 댓글 수정 모드로 전환
  const handleEditClick = (commentId, currentContent) => {
    setEditCommentId(commentId);
    setEditContent(currentContent);
  };

  // 댓글 수정 저장
  const handleSaveEdit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`,
        { content: editContent },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // 수정 성공 시, 로컬 state 갱신
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editContent } : c))
      );
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      console.error('댓글 수정 중 오류:', error);
      alert(error.response?.data?.message || '댓글 수정 중 오류 발생');
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error('댓글 삭제 중 오류:', error);
      alert(error.response?.data?.message || '댓글 삭제 중 오류 발생');
    }
  };

  //대댓글 달기 버튼 클릭
  const handleReplyClick = (commentId, commentDepth) => {
    setReplyTargetId(commentId);
    setReplyTargetDepth(commentDepth + 1);
  };

  //대댓글 작성
  const handleReplySubmit = async () => {
    if (replyContent.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/posts/comments/reply`,
          {
            postId: id,
            content: replyContent,
            parentId: replyTargetId,
            depth: replyTargetDepth,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setComments((prev) => [...prev, response.data]);
        setReplyContent('');
        setReplyTargetId(null);
        setReplyTargetDepth(0);

        setTimeout(() => {
          window.location.reload();
        }, 10);

      } catch (error) {
        console.error('대댓글 작성 중 오류 발생:', error);
        alert(error.response?.data?.message || '대댓글 작성 중 오류가 발생했습니다.');
      }
    }
  };

  // 댓글/대댓글 트리 렌더링
  const renderComments = (parentId = null, depth = 0) => {
    const filteredComments = comments.filter((c) => c.parent_id === parentId);

    return filteredComments.map((comment) => {
      const isEditing = editCommentId === comment.id;

      return (
        <div
          key={comment.id}
          style={{
            marginLeft: depth * 20,
            borderLeft: '1px solid #ccc',
            paddingLeft: 10,
            marginBottom: 10,
          }}
        >
          {isEditing ? (
            // ----- (수정 모드 UI) -----
            <>
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <button
                onClick={() => handleSaveEdit(comment.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              >
                저장
              </button>
              <button
                onClick={() => {
                  setEditCommentId(null);
                  setEditContent('');
                }}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                취소
              </button>
            </>
          ) : (
            // ----- (일반 모드 UI) -----
            <>
              <p>{comment.content}</p>
              {/* 작성자 표시 */}
              <small className="text-gray-500 block">
                작성자: {comment.user_email || '익명'}
              </small>
              <small className="text-gray-500 block">
                {new Date(comment.created_at).toLocaleString()}
              </small>
            </>
          )}

          {/* (수정, 삭제) 버튼은 "본인 댓글"일 때만 표시 */}
          {!isEditing && comment.user_email === loggedInUserEmail && (
            <div className="mt-2">
              <button
                onClick={() => handleEditClick(comment.id, comment.content)}
                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                삭제
              </button>
            </div>
          )}

          {/* (대댓글 달기) 버튼은 누구나 볼 수 있다고 가정 */}
          {!isEditing && (
            <button
              onClick={() => handleReplyClick(comment.id, comment.depth)}
              className="bg-blue-500 text-white px-3 py-1 rounded ml-2"
            >
              대댓글 달기
            </button>
          )}

          {/* 하위 대댓글 재귀 */}
          {renderComments(comment.id, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      {/* --- 게시글 정보 --- */}
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-line">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">작성자: {post.author || '익명'}</p>
      <p className="text-sm text-gray-500 mb-6">작성시간: {post.createdAt}</p>

      {/* --- 게시글 수정/삭제 버튼 --- */}
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

      {/* --- 댓글 작성 --- */}
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

      {/* --- 대댓글 작성창 (위에만 표시) --- */}
      {replyTargetId && (
        <div className="mb-6 border border-gray-200 p-4 rounded">
          <h4 className="font-semibold mb-2">대댓글 달기</h4>
          <input
            type="text"
            placeholder="대댓글 내용을 입력하세요"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleReplySubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            대댓글 작성
          </button>
        </div>
      )}

      {/* --- 댓글/대댓글 렌더링 --- */}
      <ul className="space-y-4">{renderComments()}</ul>
    </div>
  );
};

export default PostDetail;
