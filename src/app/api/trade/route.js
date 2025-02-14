import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import { protectRoute } from '@/app/api/middleware/auth';
import Counter from '@/db/models/counter.model';
import Trade from '@/db/models/trade.model';
import User from '@/db/models/user.model';
import Comment from '@/db/models/comment.model';

export const POST = async (req) => {
  try {
    await connectDB();

    // 현재 로그인한 사용자 정보 가져오기
    const authUser = await protectRoute();

    if (!authUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '로그인 후 사용해주세요.' }),
        { status: 401 }
      );
    }

    const { title, desc, haveCards, wantCards } = await req.json();

    // 거래 카운터 증가 및 새로운 거래 생성
    const counter = await Counter.findOneAndUpdate(
      { name: 'counter' },
      { $inc: { tradeCounter: 1 } },
      { new: true, upsert: true }
    );

    const newTrade = new Trade({
      tradeNum: counter.tradeCounter,
      author: authUser._id,
      title,
      description: desc,
      haveCards,
      wantCards,
    });

    await newTrade.save();

    await User.findByIdAndUpdate(authUser._id, { $push: { trades: newTrade._id } });

    return new NextResponse(JSON.stringify({ success: true, trade: newTrade }), { status: 200 });
  } catch (error) {
    console.error('Error creating trade:', error);
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

    const { tradeNum, status, title, desc, haveCards, wantCards } = await req.json();
    // 필수 필드 검증
    if (!tradeNum) {
      return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
    }

    const post = await Trade.findOne({ tradeNum });
    if (!post) {
      return NextResponse.json({ success: false, message: '글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 글 작성자인지 확인 (권한 체크)
    if (post.author.toString() !== authUser._id.toString()) {
      return NextResponse.json({ success: false, message: '수정 권한이 없습니다.' }, { status: 403 });
    }

    // 업데이트할 필드 설정
    const updatedFields = {};
    if (status) updatedFields.status = status;
    if (title) updatedFields.title = title;
    if (desc) updatedFields.description = desc;
    if (haveCards) updatedFields.haveCards = haveCards;
    if (wantCards) updatedFields.wantCards = wantCards;

    // 데이터베이스 업데이트
    const updatedPost = await Trade.findOneAndUpdate(
      { tradeNum },
      { $set: updatedFields },
      { new: true } // 업데이트된 문서 반환
    );

    return NextResponse.json({ success: true, message: '게시글이 수정되었습니다.', updatedPost }, { status: 200 });

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

    // `postId` 가져오기
    const postId = req.nextUrl.searchParams.get('postId');
    if (!postId) {
      return NextResponse.json({ success: false, message: '잘못된 요청입니다.' }, { status: 400 });
    }

    // 삭제할 게시글 찾기
    const deletedPost = await Trade.findOneAndDelete({ _id: postId, author: authUser._id });
    if (!deletedPost) {
      return NextResponse.json({ success: false, message: '삭제할 글이 없거나 권한이 없습니다.' }, { status: 403 });
    }

    // 🔥 Trade 문서에서 가져온 comments 배열에 포함된 모든 댓글 삭제
    if (deletedPost.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: deletedPost.comments } });
    }

    return NextResponse.json({ success: true, message: '글과 관련된 모든 댓글이 삭제되었습니다.' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, message: `Server error: ${error.message}` }, { status: 500 });
  }
};

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || 1);
  const postView = 10; // 한 번에 가져올 글 개수
  const skip = (page - 1) * postView;

  try {
    await connectDB();

    // 검색 조건 추가
    let query = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // 대소문자 구분 없이 검색
      query = {
        $or: [
          { title: regex },
          { description: regex },
          { 'author.pocketName': regex },
          { 'haveCards.card.name': regex },
          { 'wantCards.card.name': regex }
        ]
      };
    }

    const trade = await Trade.find(query)
      .skip(skip)
      .limit(postView)
      .sort({ createdAt: -1 })
      .populate('author', '-password')
      .populate('haveCards.card')
      .populate('wantCards.card');

    const count = await Trade.countDocuments(query); // 검색된 전체 글 개수

    return new NextResponse(JSON.stringify({ success: true, posts: trade, count }), {
      status: 200,
    });
  } catch (error) {
    return new NextResponse({ success: false, message: `Server error ${error}` }, { status: 500 });
  }
};
