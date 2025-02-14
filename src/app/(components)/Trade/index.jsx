import Card from './Card';

const index = ({ data, hasMorePosts, handleLoadMore, loading }) => {
  return (
    <div id="tradeList">
      {data?.length > 0 ? (
        data?.map((item, index) => <Card key={index} postData={item} />)
      ) : (
        <p className="noData">표시할 트레이드가 없습니다.</p>
      )}

      {hasMorePosts && (
        <div className="loadMoreBtnWrap">
          <button className="loadMoreBtn" onClick={handleLoadMore} disabled={loading}>
            {loading ? <span className="loader" /> : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default index;
