'use client';

import { useState } from 'react';

const Comment = ({
  item,
  postId,
  authUser,
  loading,
  deleteComment,
  updateComment,
  formatTimeAgo,
}) => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [localComment, setLocalComment] = useState(item.content || '');

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 삭제하시겠습니까?');
    if (confirmDelete) {
      await deleteComment({ postId, commentId: item._id });
    }
  };

  const handleUpdate = async () => {
    const confirmUpdate = confirm('수정하시겠습니까?');
    if (confirmUpdate) {
      await updateComment({ commentId: item._id, content: localComment });
      setIsUpdate(false);
    }
  };

  return (
    <li>
      <div className="commentTop">
        <div className="author">
          <div className="authorInfo">
            <p>{item.author?.pocketName || '닉네임'}</p>
            <span>({item.author?.pocketId || '0000-0000-0000'})</span>
          </div>

          <span>·</span>
          <span>{formatTimeAgo(item.createdAt)}</span>
        </div>

        {item.author?._id === authUser?._id && (
          <div className="commentBtn">
            <button type="button" onClick={() => setIsUpdate(!isUpdate)}>
              {isUpdate ? '취소' : '수정'}
            </button>
            <button type="button" onClick={handleDelete}>
              삭제
            </button>
          </div>
        )}
      </div>

      {isUpdate ? (
        <form className="commentUpdateForm" onSubmit={handleUpdate}>
          <input
            type="text"
            defaultValue={localComment}
            onChange={(e) => setLocalComment(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : '수정'}
          </button>
        </form>
      ) : (
        <p className="commentContent">{item.content}</p>
      )}
    </li>
  );
};

export default Comment;
