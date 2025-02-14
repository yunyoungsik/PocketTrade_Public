import { connectDB } from '@/lib/connectDB';
import { NextResponse } from 'next/server';
import Trade from '@/db/models/trade.model';

export const GET = async (req, { params }) => {
  try {
    await connectDB();

    const { tradeNum } = params;

    // const trade = await Trade.findById(params.tradeNum).populate('creator', '-password');
    const trade = await Trade.findOne({
      tradeNum: tradeNum,
    })
      .populate('author', '-password')
      .populate('haveCards.card')
      .populate('wantCards.card')

    if (!trade) return new NextResponse('트레이드 글을 찾을 수 없습니다.', { status: 404 });

    trade.views += 1;
    await trade.save(); // 변경 사항을 저장

    return new NextResponse(JSON.stringify(trade), { status: 200 });
  } catch (error) {
    return new NextResponse('Server Error', { status: 500 });
  }
};
