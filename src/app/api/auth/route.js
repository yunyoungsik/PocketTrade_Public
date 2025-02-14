import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDB';
import bcrypt from 'bcryptjs';
import User from '@/db/models/user.model';
import { protectRoute } from '@/app/api/middleware/auth';

export const POST = async (req) => {
  try {
    await connectDB();

    const { id, password, pocketName, pocketId } = await req.json();

    if (!id || !password || !pocketName || !pocketId) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '모든 항목을 입력해주세요.' }),
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: '비밀번호는 6글자 이상이어야 합니다',
        }),
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      $or: [{ id }, { pocketId }],
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: '이미 사용 중인 아이디나 포켓ID입니다.',
        }),
        { status: 400 }
      );
    }

    await User.create({
      id,
      password,
      pocketName,
      pocketId,
    });

    return new NextResponse(
      JSON.stringify({
        success: true,
        user: null,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log('Error in signup:', error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: 'Server error',
      }),
      { status: 500 }
    );
  }
};

export const PUT = async (req) => {
  try {
    const { userId, password, pocketName } = await req.json();

    await connectDB();

    // 현재 로그인한 사용자 정보 가져오기
    const authUser = await protectRoute();

    if (!authUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '로그인 후 사용해주세요.' }),
        { status: 401 }
      );
    }

    // 로그인한 사용자의 ID와 요청에서 받은 userId가 다르면 권한 없음 처리
    if (authUser._id.toString() !== userId) {
      return new NextResponse(JSON.stringify({ success: false, message: '권한이 없습니다.' }), {
        status: 403,
      });
    }

    const updateFields = {};

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    if (pocketName) {
      updateFields.pocketName = pocketName;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!updatedUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.password;

    return new NextResponse(
      JSON.stringify({
        success: true,
        user: userWithoutPassword,
        message: '회원 정보가 변경되었습니다.',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
    });
  }
};

export const DELETE = async (req) => {
  try {
    await connectDB();

    // 현재 로그인한 사용자 정보 가져오기
    const authUser = await protectRoute();
    console.log('authUser:', authUser); // 디버깅용 로그 추가

    if (!authUser) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '로그인 후 사용해주세요.' }),
        { status: 401 }
      );
    }

    // 요청에서 userId를 가져오기
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId'); // query parameter로 받기

    if (!userId) {
      return new NextResponse(JSON.stringify({ success: false, message: '유효하지 않은 요청입니다.' }), {
        status: 400,
      });
    }

    // 로그인한 사용자의 ID와 요청에서 받은 userId가 다르면 권한 없음 처리
    if (authUser._id.toString() !== userId) {
      return new NextResponse(JSON.stringify({ success: false, message: '권한이 없습니다.' }), {
        status: 403,
      });
    }

    // 유저 삭제
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '사용자를 찾을 수 없습니다.' }),
        { status: 404 }
      );
    }

    // 'jwt' 쿠키 삭제 (로그아웃 처리)
    const response = new NextResponse(
      JSON.stringify({ success: true, message: '회원 탈퇴 완료' }),
      { status: 200 }
    );
    response.cookies.delete('jwt');

    return response;
  } catch (error) {
    console.error('Error deleting user:', error);
    return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
    });
  }
};


export const GET = async (req) => {
  try {
    await connectDB();

    const user = await protectRoute();

    if (!user) {
      return new NextResponse(
        JSON.stringify({ success: false, message: '로그인 후 사용해주세요.' }),
        { status: 401 }
      );
    }

    const { password, ...userWithoutPassword } = user.toObject();

    return new NextResponse(JSON.stringify({ success: true, user: userWithoutPassword }), {
      status: 200,
    });
  } catch (error) {
    console.log('Error in me', error);

    return new NextResponse(JSON.stringify({ success: false, message: 'Server error' }), {
      status: 500,
    });
  }
};
