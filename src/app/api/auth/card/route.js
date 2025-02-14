import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import User from '@/db/models/user.model';
import { protectRoute } from '@/app/api/middleware/auth';

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

    const { userId, cards } = await req.json();

    // 요청한 userId와 로그인한 사용자의 ID가 일치하는지 확인
    if (authUser._id.toString() !== userId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '권한이 없습니다.' }),
        { status: 403 }
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '유저를 찾을 수 없음' }),
        { status: 404 }
      );
    }

    // 카드 데이터 형식 변환
    const formattedCards = cards.map((card) => ({
      card: card.card,
      quantity: card.quantity,
    }));

    // 유저의 카드 목록 업데이트
    user.cards = formattedCards;
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return new NextResponse(
      JSON.stringify({ success: true, message: '카드 업데이트 성공', user: userWithoutPassword }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in updateCard:', error);
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Server error' }),
      { status: 500 }
    );
  }
};
