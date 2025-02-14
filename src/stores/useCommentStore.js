import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

export const useCommentStore = create((set, get) => ({
  comments: [],
  loading: false,

  // 댓글 호출
  findComment: async (postId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/comment/${postId}`);
      set({ comments: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  // 댓글 작성
  writeComment: async (commentData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post('/comment', commentData);
      const newComment = res.data;

      set((state) => ({
        comments: [...state.comments, newComment],
      }));
      toast.success('댓글이 등록되었습니다.');
    } catch (error) {
      toast.error(error.response.data.message || '댓글 작성 실패');
    } finally {
      set({ loading: false });
    }
  },

  // 댓글 삭제
  deleteComment: async ({ postId, commentId }) => {
    try {
      set({ loading: true });
      await axiosInstance.delete(`/comment?postId=${postId}&commentId=${commentId}`);

      set((state) => ({
        comments: state.comments.filter((c) => c._id !== commentId),
      }));

      toast.success('댓글 삭제 완료');
    } catch (error) {
      toast.error(error.response?.data?.message || '댓글 삭제 실패');
    } finally {
      set({ loading: false });
    }
  },

  // 댓글 수정
  updateComment: async ({ commentId, content }) => {
    try {
      set({ loading: true });
      await axiosInstance.patch('/comment', { commentId, content });
      set((state) => ({
        comments: state.comments.map((c) => (c._id === commentId ? { ...c, content } : c)),
      }));
      toast.success('댓글 수정 완료');
    } catch (error) {
      toast.error(error.response?.data?.message || '댓글 수정 실패');
    } finally {
      set({ loading: false });
    }
  },
}));
