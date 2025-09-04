import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Data } from '../../types/types';


interface SwiperProps {
    data: Data[];
    onChange: (v: number) => void;
}

export default function PeriodSwiper(props: SwiperProps) {
    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={0}
            modules={[Navigation, Pagination]}
            navigation={{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }}
            pagination={{
                clickable: true,
                el: '.mobile-pagination',
                bulletClass: 'swiper-pagination-bullet',
                bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            onSlideChange={(swiper) => {
                const newPeriod = swiper.activeIndex;
                props.onChange(newPeriod);
            }}
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                pointerEvents: 'none',
                zIndex: 10
            }}
        >
            {props.data.map((item, index) => (
                <SwiperSlide key={index} />
            ))}
        </Swiper>

    )
}
