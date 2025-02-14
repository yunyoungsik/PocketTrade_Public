import { create } from 'zustand';
import { axiosInstance } from '@/lib/axios';
import toast from 'react-hot-toast';

export const useTradeStore = create((set, get) => ({
  post: [],
  posts: [],
  allPosts: [],
  myPosts: [],
  filterList: [],
  page: 1,
  count: 0,
  loading: false,

  // setPage
  setPage: (page) => set({ page }),

  // setCount
  setCount: (count) => set({ count }),

  // 필터 저장
  setFilterList: (list) => {
    set({ filterList: list });
    get().applyFilters();
  },

  // 필터 적용
  applyFilters: () => {
    const { allPosts, filterList } = get();

    if (!filterList || Object.keys(filterList).length === 0) {
      set({ posts: allPosts });
      return;
    }

    const filterFunctions = {
      status: (post, value) => post.status === value,
      pack: (post, value) =>
        [...post.haveCards, ...post.wantCards].some((item) => item.card.pack.codeName === value),
      category: (post, value) =>
        [...post.haveCards, ...post.wantCards].some((item) => item.card.category.name === value),
      type: (post, value) =>
        [...post.haveCards, ...post.wantCards].some((item) => item.card.type === value),
      rarity: (post, value) => {
        const [grade, num] = value.split('-');
        return [...post.haveCards, ...post.wantCards].some((item) => {
          if (!item.card.rarity) return false;
          return (
            item.card.rarity.grade === grade &&
            (num ? item.card.rarity.value === parseInt(num, 10) : true)
          );
        });
      },
      minHP: (post, value) =>
        [...post.haveCards, ...post.wantCards].some(
          (item) => parseInt(item.card.hp, 10) >= parseInt(value, 10)
        ),
      maxHP: (post, value) =>
        [...post.haveCards, ...post.wantCards].some(
          (item) => parseInt(item.card.hp, 10) <= parseInt(value, 10)
        ),
      minDamage: (post, value) =>
        [...post.haveCards, ...post.wantCards].some((item) =>
          item.card.attacks.some((attack) => parseInt(attack.damage, 10) >= parseInt(value, 10))
        ),
      maxDamage: (post, value) =>
        [...post.haveCards, ...post.wantCards].some((item) =>
          item.card.attacks.some((attack) => parseInt(attack.damage, 10) <= parseInt(value, 10))
        ),
    };

    const filteredPosts = allPosts.filter((post) =>
      Object.entries(filterList).every(([key, value]) => {
        if (value === 'all' || value === '' || value === undefined) return true;
        const filterFunction = filterFunctions[key];
        return filterFunction ? filterFunction(post, value) : true;
      })
    );

    set({ posts: filteredPosts });
  },

  // 모든 글 찾기
  // 모든 글 찾기 (더보기 버튼 기능 추가)
  fetchPosts: async (searchText = '', page = 1) => {
    try {
      set({ loading: true });

      // 서버에서 검색어 포함된 데이터를 가져옴 (페이지네이션 적용)
      const res = await axiosInstance.get(
        `/trade?search=${encodeURIComponent(searchText)}&page=${page}`
      );

      // 기존 posts 배열에 새 데이터를 추가하는 방식으로 수정
      const prevPosts = get().posts; // 기존에 불러온 글 목록
      const newPosts = res.data.posts.map((post) => ({
        ...post,
        haveCards: [...post.haveCards].sort((a, b) => a.card.cardId.localeCompare(b.card.cardId)),
        wantCards: [...post.wantCards].sort((a, b) => a.card.cardId.localeCompare(b.card.cardId)),
      }));

      // 페이지가 1이면 기존 데이터 삭제 후 새로운 데이터 저장
      // 페이지가 2 이상이면 기존 데이터에 추가
      const updatedPosts = page === 1 ? newPosts : [...prevPosts, ...newPosts];

      set({
        allPosts: updatedPosts,
        posts: updatedPosts,
        page, // 현재 페이지 저장
        count: res.data.count, // 전체 글 개수 저장
      });
    } catch (error) {
      console.log('fetchPosts:', error);
    } finally {
      set({ loading: false });
    }
  },

  // 글 찾기
  findPost: async (tradeNum) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/trade/view/${tradeNum}`, tradeNum);
      const sortedPost = {
        ...res.data,
        haveCards: [...res.data.haveCards].sort((a, b) =>
          a.card.cardId.localeCompare(b.card.cardId)
        ),
        wantCards: [...res.data.wantCards].sort((a, b) =>
          a.card.cardId.localeCompare(b.card.cardId)
        ),
      };
      set({ post: sortedPost });
    } catch (error) {
      toast.error(error.response.data.message || '트레이드 불러오기 에러');
    } finally {
      set({ loading: false });
    }
  },

  // 내 글 호출
  findMyPosts: async (authorId) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get('/trade');
      const findMyPosts = res.data.posts.filter((post) => post.author._id === authorId);
      set({ myPosts: findMyPosts, posts: res.data.posts });
    } catch (error) {
      console.log('findMyPosts: ', error);
    } finally {
      set({ loading: false });
    }
  },

  // 글 작성
  writePost: async (writeData) => {
    try {
      set({ loading: true });
      await axiosInstance.post('/trade', writeData);
      return true;
    } catch (error) {
      toast.error(error.response.data.message || '데이터 불러오기 실패');
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // 글 업데이트
  updatePost: async (updateData) => {
    try {
      set({ loading: true });
      await axiosInstance.patch('/trade', updateData);
      return true;
    } catch (error) {
      console.log('updatePost: ', error);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  // 글 삭제
  deletePost: async (postId) => {
    try {
      set({ loading: true });
      await axiosInstance.delete(`/trade/delete?postId=${postId}`);
      toast.success('트레이드 삭제 완료');
    } catch (error) {
      toast.error(error.response.data.message || '트레이드 삭제 실패');
    } finally {
      set({ loading: false });
    }
  },
}));
