import { NextResponse } from 'next/server'; // NextResponse 임포트

export const POST = async (req) => {
  // 쿠키 삭제
  const response = new NextResponse(
    JSON.stringify({ success: true, message: '로그아웃 성공' }),
    { status: 200 }
  );

  // 'jwt' 쿠키 삭제
  response.cookies.delete('jwt');

  return response;
};