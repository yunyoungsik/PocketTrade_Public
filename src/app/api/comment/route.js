import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { protectRoute } from '@/app/api/middleware/auth';
import Comment from '@/db/models/comment.model';
import Trade from '@/db/models/trade.model';

export const POST = async (req) => {
  try {
    await connectDB();

    const authUser = await protectRoute();

    if (!authUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '로그인 후 사용해주세요.' }),
        { status: 401 }
      );
    }

    const { postId, comment } = await req.json();

    if (!postId || !comment) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '모든 필드를 입력해주세요.' }),
        { status: 400 }
      );
    }

    const newComment = new Comment({
      postId,
      author: authUser._id,
      content: comment,
    });

    await newComment.save();

    await Trade.findByIdAndUpdate(postId, {$push: {comments: newComment._id}});

    return new NextResponse(JSON.stringify({ success: true, comment: newComment }), {
      status: 201,
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: `Server error: ${error.message}` }),
      { status: 500 }
    );
  }
};

export const PATCH = async (req) => {
  try {
    await connectDB();

    // 현재 로그인한 사용자 정보 가져오기
    const authUser = await protectRoute();
    if (!authUser) {
      return NextResponse.json({ success: false, message: '로그인 후 사용해주세요.' }, { status: 401 });
    }

    // 요청에서 `commentId`와 `content` 추출
    const { commentId, content } = await req.json();
    
    if (!commentId || !content.trim()) {
      return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 수정할 댓글 찾기
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json({ success: false, message: '댓글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 댓글 작성자인지 확인 (권한 체크)
    if (comment.author.toString() !== authUser._id.toString()) {
      return NextResponse.json({ success: false, message: '수정 권한이 없습니다.' }, { status: 403 });
    }

    // 댓글 내용 업데이트
    comment.content = content;
    await comment.save();

    return NextResponse.json({ success: true, message: '댓글이 수정되었습니다.', updatedComment: comment }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();

    // 현재 로그인한 사용자 정보 가져오기
    const authUser = await protectRoute();
    if (!authUser) {
      return NextResponse.json({ success: false, message: '로그인 후 사용해주세요.' }, { status: 401 });
    }

    // `req.nextUrl.searchParams`에서 `postId`, `commentId` 가져오기
    const postId = req.nextUrl.searchParams.get('postId');
    const commentId = req.nextUrl.searchParams.get('commentId');

    if (!commentId || !postId) {
      return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 댓글 삭제 (조회 없이 바로 삭제)
    const deletedComment = await Comment.findOneAndDelete({ _id: commentId, author: authUser._id });

    if (!deletedComment) {
      return NextResponse.json({ success: false, message: '삭제할 댓글이 없거나 권한이 없습니다.' }, { status: 403 });
    }

    // Trade 문서에서 댓글 ID 제거 (가벼운 updateOne 사용)
    await Trade.updateOne({ _id: postId }, { $pull: { comments: commentId } });

    return NextResponse.json({ success: true, message: '댓글이 삭제되었습니다.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 });
  }
};