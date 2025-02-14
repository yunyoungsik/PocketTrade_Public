import User from '@/db/models/user.model';
import { connectDB } from '@/lib/connectDB';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const signToken = (id) => {
  // jwt token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const POST = async (req, res) => {
  try {
    const { id, password } = await req.json();

    await connectDB();

    if (!id || !password) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '모든 항목을 입력해주세요.' }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ id }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: '아이디/비밀번호가 맞지 않습니다.',
        }),
        { status: 400 }
      );
    }

    const token = signToken(user._id);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const response = new NextResponse(
      JSON.stringify({ success: true, message: '로그인 성공', user: userWithoutPassword }),
      { status: 200 }
    );

    response.cookies.set('jwt', token, {
      httpOnly: true, // XSS 방지
      maxAge: 7 * 24 * 60 * 60, // 7일 동안 쿠키 유지
      sameSite: 'strict', // CSRF 공격 방지
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서만 HTTPS 연결
    });

    return response;
  } catch (error) {
    console.log('Error in login', error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
    });
  }
};
