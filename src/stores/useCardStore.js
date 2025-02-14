import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

export const useCardStore = create((set) => ({
  cards: [],
  loading: false,

  getCards: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get('/card');
      set({ cards: res.data.cards });
    } catch (error) {
      set({ cards: [] });
      toast.error(error.response.data.message || '카드 데이터 에러');
    } finally {
      set({ loading: false });
    }
  },
}));
