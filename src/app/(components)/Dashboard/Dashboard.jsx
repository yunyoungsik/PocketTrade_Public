'use client';

import MainSlider from '@/app/(components)/Dashboard/MainSlider';
import Trade from '@/app/(components)/Trade';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTradeStore } from '@/stores/useTradeStore';
import { useEffect } from 'react';

const Dashboard = () => {
  const { loading,myPosts, posts, findMyPosts } = useTradeStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser) return;
    findMyPosts(authUser._id);
  }, [authUser]);

  if(loading) return <div className='loader-wrap'><span className='loader' /></div>;

  return (
    <div id="dashboard">
      <div className="dashboardSlider">
        <MainSlider />
      </div>

      <div className="dashboardNewTrade dashboardCard">
        <h2 className="newTradeTitle">{authUser ? '내 트레이드' : '최신 트레이드'}</h2>

        <div className="newTradeList">
          {authUser ? <Trade data={myPosts} /> : <Trade data={posts} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
