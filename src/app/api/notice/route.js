import { connectToDB } from '@/utils/database';
import Notice from '@/models/notice';
import Counter from '@/models/counter';

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page");
  const postView = 10;
  const skip = (page - 1) * postView;

  try {
    await connectToDB();

    // 해당 페이지에 맞는 데이터를 DB에서 조회
    const notices = await Notice.find({}).populate('creator').sort({ createdAt: -1 }).skip(skip).limit(postView);
    const count = await Notice.countDocuments({});

    return new Response(JSON.stringify({notices, count}), { status: 200 });
  } catch (error) {
    return new Response('Notice Server Error' , { status: 500 });
  }
};