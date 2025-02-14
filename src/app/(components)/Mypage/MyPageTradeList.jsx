'use client'

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTradeStore } from "@/stores/useTradeStore";
import Trade from '@/app/(components)/Trade';

const page = () => {
  const { loading, myPosts, findMyPosts } = useTradeStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!authUser) return;
    findMyPosts(authUser._id);
  }, [authUser]);

  if (loading)
    return (
      <div className="loader-wrap">
        <span className="loader" />
      </div>
    );

  return (
    <div id="myTradeList">
      <div className="newTradeList">
        <Trade data={myPosts} />
      </div>
    </div>
  );
};

export default page;
