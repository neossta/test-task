import { Swiper, SwiperRef, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { $blueColor, $phoneWidth } from '../../styles/veriables';


interface SwiperProps {
    events: {
        year: number,
        description: string,
    }[]
}

export default function (props: SwiperProps) {
    const navigationPrevRef = useRef<HTMLDivElement>(null);
    const navigationNextRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<SwiperRef>(null);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.swiper.slideTo(0);
        }
    }, [props.events])
    return (
        <SwiperContainer style={{ position: 'relative' }}>
            <Swiper
                ref={swiperRef}
                spaceBetween={50}
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                navigation={{
                    prevEl: navigationPrevRef.current,
                    nextEl: navigationNextRef.current,
                }}
                modules={[Navigation]}
                onBeforeInit={(swiper) => {
                    if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                        swiper.params.navigation.prevEl = navigationPrevRef.current;
                        swiper.params.navigation.nextEl = navigationNextRef.current;
                    }
                }}
                breakpoints={{
                    320: {
                        slidesPerView: 1.5,
                        spaceBetween: 10,
                    },
                    769: {
                        slidesPerView: 3,
                        spaceBetween: 50,
                    },
                }}
            >
                {props.events.map((e, i) => (
                    <SwiperSlide key={i}><SwiperBlock year={e.year} descr={e.description} /></SwiperSlide>
                ))}
            </Swiper>
            <PrevButton
                ref={navigationPrevRef}
                className="swiper-button-prev-custom"
            />
            <NextButton
                ref={navigationNextRef}
                className="swiper-button-next-custom"
            />
        </SwiperContainer>
    )
}

const SwiperContainer = styled.div`
  position: relative;
  padding: 20px 45px 30px 55px;
  margin: 0;
  @media (max-width: ${$phoneWidth}) {
    border-top: 1px solid #C7CDD9;
    padding-left: 0;
    pdding-right: 0;
  }
`;
const NavigationButton = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  transition: opacity 0.3s ease;
  
  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-right: 2px solid #3877EE;
    border-bottom: 2px solid #3877EE;
    transform: rotate(-45deg);
  }
  
  &.swiper-button-disabled {
    opacity: 0;
    cursor: auto;
    pointer-events: none;
  }
  
  @media (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

const PrevButton = styled(NavigationButton)`
  left: 10px;
  
  &::after {
    transform: rotate(135deg);
    margin-right: -2px;
  }
`;

const NextButton = styled(NavigationButton)`
  right: 10px;
  
  &::after {
    transform: rotate(-45deg);
    margin-left: -2px;
  }
`;

function SwiperBlock(props: { year: number, descr: string }) {
    return (
        <Block>
            <Year>{props.year}</Year>
            <Descr>{props.descr}</Descr>
        </Block>
    )
}

const Block = styled.div` 
`;

const Year = styled.span`
  font-size: 20px;
  font-weight: 500;
  color: #3877EE;
`;

const Descr = styled.div`
  font-size: 20px;
  color: ${$blueColor};
  padding-top: 10px;
  @media (max-width: ${$phoneWidth}) {
   font-size: 16px;
  }
`;
