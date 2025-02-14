import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

const DeleteIdBtn = () => {
  const { authUser, deleteId } = useAuthStore();
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm('정말로 탈퇴하시겠습니까?');
    if (confirmDelete) {
      
      const success = await deleteId(authUser?._id);
      if (success) {
        router.push('/');
      }
    }
  };

  return (
    <button type="button" className="deleteIdBtn" onClick={handleDelete}>
      탈퇴하기
    </button>
  );
};

export default DeleteIdBtn;
