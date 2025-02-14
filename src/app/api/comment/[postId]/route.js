import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';
import Comment from '@/db/models/comment.model';

export const GET = async (req, { params }) => {
  try {
    await connectDB();

    const { postId } = params;

    const comments = await Comment.find({
      postId,
    }).populate('author', '-password');

    if (!comments.length) return new NextResponse('댓글을 찾을 수 없습니다.', { status: 404 });

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    return new NextResponse('Server Error', { status: 500 });
  }
};
