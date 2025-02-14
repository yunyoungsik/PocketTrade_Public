import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useCommentStore } from '@/stores/useCommentStore';

const CommentForm = ({ authorId, postId }) => {
  const [comment, setComment] = useState('');
  const { loading, findComment, writeComment } = useCommentStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error('댓글을 입력해주세요.');
    await writeComment({ postId, authorId, comment });
    await findComment(postId);
    setComment('');
  };

  return (
    <form id="commentForm" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="댓글을 입력해주세요."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? <span className="loader" /> : '등록'}
      </button>
    </form>
  );
};

export default CommentForm;
