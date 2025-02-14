'use client';

import { useEffect } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import CommentForm from '@/app/(components)/Form/CommentForm';
import Comment from '@/app/(components)/Trade/Comment';

const CommentList = ({ authUser, post, findPost, formatTimeAgo }) => {
  const { loading, comments, findComment, deleteComment, updateComment } = useCommentStore();

  useEffect(() => {
    if (post?.comments?.length > 0) {
      findComment(post?._id);
    }
  }, [post]);

  if (loading)
    return (
      <div className="tradeComment">
        <span className="loader" />
      </div>
    );

  return (
    <div className="tradeComment">
      {authUser && <CommentForm authorId={authUser?._id} postId={post?._id} findPost={findPost} />}

      {comments?.length === 0 ? (
        <ul className="noComment">
          <li>작성된 댓글이 없습니다.</li>
        </ul>
      ) : (
        <ul className="commentList">
          {comments?.map((item, index) => (
            <Comment
              key={index}
              item={item}
              postId={item.postId}
              authUser={authUser}
              loading={loading}
              findPost={findPost}
              findComment={findComment}
              deleteComment={deleteComment}
              updateComment={updateComment}
              formatTimeAgo={formatTimeAgo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentList;
