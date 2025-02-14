import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  loading: false,
  authUser: null,
  checkingAuth: true,

  signup: async (singupData) => {
    try {
      set({ loading: true });
      await axiosInstance.post('/auth', singupData);
      toast.success('회원가입 완료');
      return true;
    } catch (error) {
      toast.error(error.response.data.message || '회원가입 에러');
    } finally {
      set({ loading: false });
    }
    return false;
  },

  login: async (loginData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/login', loginData);
      set({ authUser: res.data.user });
      toast.success('로그인 완료');
      return true;
    } catch (error) {
      toast.error(error.response.data.message || '로그인 에러');
    } finally {
      set({ loading: false });
    }
    return false;
  },

  logout: async () => {
    try {
      const res = await axiosInstance.post('/auth/logout');
      if (res.status === 200) set({ authUser: null });
    } catch (error) {
      toast.error(error.response.data.message || '로그아웃 에러');
    }
  },

  update: async (changeData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.put('/auth', changeData);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || '회원 정보 변경에 실패했습니다.');
    } finally {
      set({ loading: false });
    }
  },

  deleteId: async (userId) => {
    try {
      set({ loading: true });
  
      const res = await axiosInstance.delete(`/auth?userId=${userId}`); // 쿼리 파라미터로 전달
  
      if (res.data.success) {
        toast.success('회원탈퇴가 완료되었습니다.');
        set({ authUser: null });
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || '회원탈퇴에 실패했습니다.');
    } finally {
      set({ loading: false });
    }
    return false;
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth');
      set({ authUser: res.data.user });
    } catch (error) {
      set({ authUser: null });
      console.log(error);
    } finally {
      set({ checkingAuth: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),

  updateCard: async (cardData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/auth/card', cardData);
      set({ authUser: res.data.user });
      toast.success('카드 업데이트 완료');
    } catch (error) {
      toast.error(error.response?.data?.message || '카드 업데이트 에러');
    } finally {
      set({ loading: false });
    }
  },
}));
