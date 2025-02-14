import Notice from '@/models/notice';
import { connectToDB } from '@/utils/database';

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const notice = await Notice.findById(params.id).populate('creator');
    if (!notice) return new Response('Notice ID Not Defined Server Error', { status: 404 });

    notice.view += 1;
    await notice.save(); // 변경 사항을 저장

    return new Response(JSON.stringify(notice), { status: 200 });
  } catch (error) {
    return new Response('Notice ID GET Server Error', { status: 500 });
  }
};

export const PATCH = async (request, { params }) => {
  const { title, desc } = await request.json();

  try {
    await connectToDB();

    const existingNotice = await Notice.findById(params.id);

    if (!existingNotice) {
      return new Response('Notice ID PATCH Server Error', { status: 404 });
    }

    existingNotice.title = title;
    existingNotice.desc = desc;

    await existingNotice.save();

    return new Response('Notice ID PATCH Success', { status: 200 });
  } catch (error) {
    return new Response('Notice ID PATCH Server Error', { status: 500 });
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    await Notice.findByIdAndDelete(params.id);

    return new Response('Notice ID DELETE Success', { status: 200 });
  } catch (error) {
    return new Response('Notice ID DELETE Server Error', { status: 500 });
  }
};