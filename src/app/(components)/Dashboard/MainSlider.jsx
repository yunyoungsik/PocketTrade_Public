'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

const MainSlider = () => {
  return (
    <div className="mainSlider">
      <Swiper
        slidesPerView={'auto'}
        spaceBetween={20}
        centeredSlides={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
          type: 'custom',
          renderCustom: (swiper, current, total) => `${current} / ${total}`,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
        <SwiperSlide></SwiperSlide>
      </Swiper>

      {/* 커스텀 페이지네이션 표시 */}
      <div className="paginationBox">
        <div className="custom-pagination"></div>
      </div>
    </div>
  );
};

export default MainSlider;
