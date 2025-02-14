import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/db/models/user.model';

export const protectRoute = async (req) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) return null;

    const currentUser = await User.findById(decoded.id);
    return currentUser || null;
  } catch (error) {
    console.log('Error in auth middleware:', error);
    return null;
  }
};
