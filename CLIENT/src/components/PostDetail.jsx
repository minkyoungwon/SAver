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

  // 댓글 수정
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const loggedInUserId = parseInt(localStorage.getItem('userId'));

  // (1) 게시글 불러오기
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

  // (2) 댓글 불러오기
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

  // 게시글 로딩 중 처리
  if (!post) {
    return <div>게시글 로딩중...</div>;
  }

  // (3) 게시글 삭제
  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p.id !== Number(id)));
      Swal.fire('삭제 완료', '게시글이 삭제되었습니다!', 'success');
      navigate('/');
    } catch (error) {
      Swal.fire('삭제 실패', '게시글 삭제 중 오류가 발생했습니다.', 'error');
    }
  };

  // (4) 댓글 작성
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
      Swal.fire('작성 실패', '댓글 작성 중 오류 발생', 'error');
    }
  };

  // (5) 댓글 수정 모드
  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditContent(comment.content);
  };

  // (6) 댓글 수정 저장
  const handleSaveEdit = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`,
        { content: editContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(
        comments.map((c) => (c.id === commentId ? { ...c, content: editContent } : c))
      );
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      Swal.fire('수정 실패', '댓글 수정 중 오류 발생', 'error');
    }
  };

  // (7) 댓글 삭제
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/posts/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      Swal.fire('삭제 실패', '댓글 삭제 중 오류 발생', 'error');
    }
  };

  // (8) 대댓글 작성
  const handleReply = async () => {
    if (!replyContent.trim() || !replyTargetId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts/comments/reply`,
        { postId: id, content: replyContent, parentId: replyTargetId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([...comments, response.data]);
      setReplyContent('');
      setReplyTargetId(null);
    } catch (error) {
      Swal.fire('대댓글 작성 실패', '오류가 발생했습니다.', 'error');
    }
  };

  /**
   * (9) 댓글/대댓글 트리 구조 만들기
   *  - 각 댓글에 children 배열을 붙여 계층화
   */
  function buildCommentTree(flatComments) {
    const map = {};
    // 먼저 모든 댓글을 { ...comment, children: [] } 형태로 map에 저장
    flatComments.forEach((c) => {
      map[c.id] = { ...c, children: [] };
    });

    const rootComments = [];

    // parent_id가 있으면 해당 parent의 children에 push
    // 없으면 rootComments(최상위 댓글)로
    for (let id in map) {
      const comment = map[id];
      if (comment.parent_id) {
        if (map[comment.parent_id]) {
          map[comment.parent_id].children.push(comment);
        } else {
          // 혹시 부모가 없는 경우 그냥 root에 두기 (오류 방지)
          rootComments.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    }
    return rootComments;
  }

  /**
   * (10) 재귀적으로 트리 렌더링
   *  - comment.children을 돌면서 계속 렌더링
   */
  function renderComments(commentTree, depth = 0) {
    return commentTree.map((comment) => {
      // 수정 중인 댓글인지 확인
      const isEditing = editCommentId === comment.id;

      return (
        <div key={comment.id} style={{ marginLeft: depth * 20, borderLeft: '1px solid #ccc', paddingLeft: '8px', marginTop: '8px' }}>
          {/* 수정 중이면 input 노출, 아니면 그냥 text */}
          {isEditing ? (
            <div>
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border p-1 rounded w-full"
              />
              <button onClick={() => handleSaveEdit(comment.id)} className="bg-blue-500 text-white px-2 py-1 rounded mt-1">
                저장
              </button>
            </div>
          ) : (
            <div>
              <p>{comment.content}</p>
              {/* 작성자/작성시간 */}
              <small className="text-gray-500">
                작성자: {comment.users?.email || '익명'} /{' '}
                {comment.posted_at ? new Date(comment.posted_at).toLocaleString() : ''}
              </small>
            </div>
          )}

          {/* 본인 댓글이면 수정/삭제 버튼 */}
          {comment.user_id === loggedInUserId && !isEditing && (
            <>
              <button onClick={() => handleEditClick(comment)} className="text-blue-500 ml-2">
                수정
              </button>
              <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500 ml-2">
                삭제
              </button>
            </>
          )}

          {/* 대댓글 버튼 (클릭하면 replyTargetId 지정) */}
          {!isEditing && (
            <button
              onClick={() => {
                setReplyTargetId(comment.id);
              }}
              className="text-green-500 ml-2"
            >
              대댓글 달기
            </button>
          )}

          {/* 자식 댓글들 재귀 렌더링 */}
          {renderComments(comment.children, depth + 1)}
        </div>
      );
    });
  }

  // 댓글을 트리로 만들고 렌더링
  const commentTree = buildCommentTree(comments);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
      <p className="text-gray-700 mb-4">{post.content}</p>
      <p className="text-right text-sm text-gray-500">
        작성자: {post.author || '익명'}, 조회수: {post.view_count}
      </p>

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
      <div className="my-2">
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
      </div>

      {/* 댓글 트리 렌더링 */}
      <div>{renderComments(commentTree)}</div>

      {/* 대댓글 작성창: replyTargetId 있을 때만 노출 */}
      {replyTargetId && (
        <div className="mt-4">
          <h4>대댓글 달기</h4>
          <input
            type="text"
            placeholder="대댓글 내용"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleReply} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            작성
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
