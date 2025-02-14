import { useState } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const ChangeForm = () => {
  const { loading, authUser, update } = useAuthStore();
  const [id, setId] = useState(authUser?.id || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pocketName, setPocketName] = useState(authUser?.pocketName);
  const [pocketIdParts, setPocketIdParts] = useState([
    authUser?.pocketId.split('-')[0],
    authUser?.pocketId.split('-')[1],
    authUser?.pocketId.split('-')[2],
    authUser?.pocketId.split('-')[3],
  ]);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    await update({
      userId: authUser._id,
      password: password || undefined,
      pocketName,
    });
  };

  if (loading)
    return (
      <div className="loader-wrap">
        <span className="loader" />
      </div>
    );

  return (
    <form id="changeForm" onSubmit={handleSubmit}>
      <div className="changeFormBox">
        <label htmlFor="id">아이디</label>
        <div className="inputBox">
          <input type="text" value={id} disabled />
        </div>
      </div>

      <div className="changeFormBox">
        <label htmlFor="password">비밀번호</label>
        <div className="inputBox">
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            minLength={6}
            maxLength={16}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            className="passwordVisible"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="changeFormBox">
        <label htmlFor="">비밀번호확인</label>
        <div className="inputBox">
          <input
            type={passwordVisible ? 'text' : 'password'}
            value={confirmPassword}
            minLength={6}
            maxLength={16}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="button"
            className="passwordVisible"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>

      <div className="changeFormBox">
        <label htmlFor="">Pocket 닉네임</label>
        <div className="inputBox">
          <input type="text" value={pocketName} onChange={(e) => setPocketName(e.target.value)} />
        </div>
      </div>

      <div className="changeFormBox pocketId">
        <label htmlFor="">Pocket ID</label>
        <div className="inputBox">
          {pocketIdParts.map((part, index) => (
            <input
              key={index}
              type="text"
              minLength={4}
              maxLength={4}
              value={part}
              onChange={(e) => handlePocketIdChange(index, e.target.value)}
              disabled
            />
          ))}
        </div>
      </div>

      <button type="submit" className="changeBtn" disabled={loading}>
        {loading ? <span className="loader" /> : '변경하기'}
      </button>
    </form>
  );
};

export default ChangeForm;
