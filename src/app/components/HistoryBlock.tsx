import { useEffect, useState } from "react";
import styled from "styled-components";
import { $blueColor, $iris, $mainBackgroundColor, $phoneWidth, $pink } from "../../styles/veriables";
import mockData from "../mockData";
import EventsSwiper from "./EventsSwiper";
import PeriodSwiper from "./PeriodSwiper";
import { Data } from "../../types/types";
import { API } from "../../api/api";

const HistoryBlock: React.FC = () => {
  const [period, setPeriod] = useState<number>(1);
  const [activePoint, setActivePoint] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);


  const [data, setData] = useState<Data[]>(mockData);

  const [displayStartYear, setDisplayStartYear] = useState<number>(data[1].startYear);
  const [displayEndYear, setDisplayEndYear] = useState<number>(data[1].endYear);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  async function fetchData() {
    try {
      const response = await API.getData();
      setData(response);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      throw error;
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    let rotation = 360 / data.length;
    if (rotation > 60) {
      rotation = 60;
    }
    setRotation(-rotation);
  }, [data.length]);

  useEffect(() => {
    const animateYears = () => {
      const targetStart = data[period].startYear;
      const targetEnd = data[period].endYear;
      const currentStart = displayStartYear;
      const currentEnd = displayEndYear;

      const startDiff = targetStart - currentStart;
      const endDiff = targetEnd - currentEnd;
      const duration = 500;
      const steps = 30;
      const stepTime = duration / steps;

      setIsAnimating(true);

      let step = 0;
      const timer = setInterval(() => {
        step++;

        if (step <= steps) {
          const progress = step / steps;
          const easeProgress = 1 - Math.pow(1 - progress, 3);

          setDisplayStartYear(Math.floor(currentStart + startDiff * easeProgress));
          setDisplayEndYear(Math.floor(currentEnd + endDiff * easeProgress));
        } else {
          clearInterval(timer);
          setDisplayStartYear(targetStart);
          setDisplayEndYear(targetEnd);
          setIsAnimating(false);
        }
      }, stepTime);

      return () => clearInterval(timer);
    };

    animateYears();
  }, [period, data]);

  const handlePointClick = (index: number) => {
    if (isAnimating) return;
    const anglePerPoint = 360 / data.length;
    const targetAngle = -anglePerPoint * index - 60;
    setRotation(targetAngle);
    setActivePoint(index);
    setPeriod(index);
  };

  const handleNext = () => {
    if (period < data.length - 1 && !isAnimating) {
      setPeriod(prev => prev + 1);
      setActivePoint(prev => prev + 1);
      handlePointClick(period + 1);
    }
  };

  const handlePrev = () => {
    if (period > 0 && !isAnimating) {
      setPeriod(prev => prev - 1);
      setActivePoint(prev => prev - 1);
      handlePointClick(period - 1);
    }
  };

  const NavigationControls = () => (
    <NavigationWrapper>
      <PeriodCounter>
        {String(period + 1).padStart(2, '0')}/{String(data.length).padStart(2, '0')}
      </PeriodCounter>

      <NavButtons>
        <PrevButton
          onClick={handlePrev}
          $isDisabled={period === 0}
        />
        <NextButton
          onClick={handleNext}
          $isDisabled={period === data.length - 1}
        />
      </NavButtons>
      <MobilePagination>
        {data.map((_, index) => (
          <PaginationDot
            key={index}
            $isActive={index === period}
            onClick={() => {
              setPeriod(index);
              setActivePoint(index);
              handlePointClick(index);
            }}
          />
        ))}
      </MobilePagination>
    </NavigationWrapper>
  );
  return (
    <Container>
      <VerticalCenterLine />
      <ContentContainer>
        <TitleContainer>
          <GradientStripe></GradientStripe>
          <Title>Исторические даты</Title>
        </TitleContainer>
        <div style={{ position: 'relative' }}>
          <CircleContainer>
            <Circle $rotation={rotation}>
              {data.map((el, index) => {
                const angle = (360 / data.length) * index;
                const isActive = index === activePoint;

                return (
                  <Point
                    key={index}
                    $angle={angle}
                    $isActive={isActive}
                    $rotation={rotation}
                    onClick={() => handlePointClick(index)}
                    data-label={el.title}
                  >
                    <PointNumber>{index + 1}</PointNumber>
                    <PointTitle>{el.title}</PointTitle>
                  </Point>
                );
              })}
            </Circle>
            <HorizontalCenterLine />
            <Years>
              <Start>{displayStartYear}</Start>
              <End>{displayEndYear}</End>
            </Years>
          </CircleContainer>
          <DesctopNavigation>
            <NavigationControls />
          </DesctopNavigation>
        </div>
        <MobileYearsBlock>
          <Years>
            <Start>{displayStartYear}</Start>
            <End>{displayEndYear}</End>
          </Years>
        </MobileYearsBlock>

        <PeriodSwiper data={data} onChange={(p) => {
          setPeriod(p);
          setActivePoint(p);
          handlePointClick(p);
        }} />
        <EventsSwiper events={data[period].events} />

      </ContentContainer>
      <MobileNavigation>
        <NavigationControls />
      </MobileNavigation>
    </Container>
  );
};


const Container = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
  @media screen and (max-height: ${$phoneWidth}) {
  }
`;

const ContentContainer = styled.div`
  position: relative;
  flex: 1;
  width: 80vw;
  margin: 0 auto;
  height: 100%;
  padding: 20px 0;
  border-left: 1px solid rgba(66, 86, 122, 0.5);
  border-right: 1px solid rgba(66, 86, 122, 0.5);

  @media screen and (max-width: ${$phoneWidth}) {
    width: 100%;
    padding: 0 15px;
    border: none;
  }
`;

const HorizontalCenterLine = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 0.5px;
  transform: translate(-50%);
  background: rgba(66, 86, 122, 0.5);
  z-index: 10;
  @media screen and (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

const VerticalCenterLine = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 0.5px;
  height: 100%;
  background: rgba(66, 86, 122, 0.5);
  z-index: 100;
  @media screen and (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

const TitleContainer = styled.div`
  position: relative;
  width: 40vw;
  display: flex;
  align-items: center;

  @media screen and (max-width: ${$phoneWidth}) {
    margin-top: 50px;
    width: 40vw;
    margin-bottom: 50px;
  }
`;

const Title = styled.p`
  color: ${$blueColor};
  font-size: 50px;
  font-weight: 700;
  line-height: 120%;

  @media screen and (max-width: ${$phoneWidth}) {
    font-size: 30px;
  }
`;

const GradientStripe = styled.div`
  width: 5px;
  background: linear-gradient(to bottom, #3877EE, #EF5DA8);
  margin-right: 20px;
  align-self: stretch;
  margin-left: 1px;

  @media screen and (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

const CircleContainer = styled.div`
  position: relative;
  width: 350px;
  height: 350px;
  margin: 0 auto 40px auto;

  @media screen and (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

interface PointProps {
  $angle: number;
  $isActive: boolean;
  $rotation: number;
}

interface CircleProps {
  $rotation: number;
}

const Circle = styled.div<CircleProps>`
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px solid rgba(66, 86, 122, 0.5);
  border-radius: 50%;
  transition: transform 0.5s ease;
  transform: rotate(${props => props.$rotation}deg);
  background-color: 'transparent';
  z-index: 1000;
`;

const Point = styled.div<PointProps>`
  box-sizing: border-box;
  position: absolute;
  top: ${props => props.$isActive ? 'calc(50% - 28px)' : 'calc(50% - 3px)'};
  left: ${props => props.$isActive ? 'calc(50% - 28px)' : 'calc(50% - 3px)'};
  width: ${props => props.$isActive ? '56px' : '6px'};
  height: ${props => props.$isActive ? '56px' : '6px'};
  background-color: ${props => props.$isActive ? $mainBackgroundColor : $blueColor};
  border: ${props => props.$isActive ? '1px solid #303E58' : 'none'};
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center;
  transform: 
    rotate(${props => props.$angle}deg) 
    translate(175px) 
    rotate(-${props => props.$angle}deg)
    rotate(${props => -props.$rotation}deg);
  
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${$mainBackgroundColor};
    width: 56px;
    height: 56px;
    top: calc(50% - 28px);
    left: calc(50% - 28px);
    border: 1px solid #303E58;
    
    > span {
      visibility: visible;
    }
  }

  > span {
    visibility: ${props => props.$isActive ? 'visible' : 'hidden'};
  }

  > p {
    visibility: ${props => props.$isActive ? 'visible' : 'hidden'};
  }
`;

const PointNumber = styled.span`
  color: ${$blueColor};
  font-size: 20px;
  text-align: center;
`;

const PointTitle = styled.p`
  position: absolute;
  top: 35%;
  left: 100%;
  margin-left: 20px;
  color: ${$blueColor};
  font-weight: 500;
  white-space: nowrap;
`;

const Years = styled.div`
  position: absolute;
  display: flex;
  top: calc(50%);
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  gap: 40px;
  @media (max-width: ${$phoneWidth}) {
    display: flex;
    position: relative;
    margin: 30px auto;
    align-items: center;
    justify-content: center;
  }
`;

const Start = styled.p`
  color: ${$iris};
  font-weight: 700;
  font-size: 100px;
  transition: all 0.1s ease;
  @media (max-width: ${$phoneWidth}) {
    font-size: 60px;
  }
`;

const End = styled.p`
  color: ${$pink};
  font-weight: 700;
  font-size: 100px;
  transition: all 0.1s ease;
  @media (max-width: ${$phoneWidth}) {
    font-size: 60px;
  }
`;

const MobileYearsBlock = styled.div`
  display: none;
  height: auto;
  @media (max-width: ${$phoneWidth}) {
    display: block;
    padding: 20px;
  }
`;

const DesctopNavigation = styled.div`
 @media screen and (max-width: ${$phoneWidth}) {
    display: none;
  }
`;

const MobileNavigation = styled.div`
  display: none;
  @media screen and (max-width: ${$phoneWidth}) {
    display: flex;
    margin-top: auto;
    margin-bottom: 13vh;
  }
  `;
const NavigationWrapper = styled.div`
  position: absolute;
  bottom: -10px;
  left: 50px;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  z-index: 10;

  @media screen and (max-width: ${$phoneWidth}) {
    position: relative;
    flex: 1;
    left: 0;
    padding: 10px;
    overflow: hidden;
  }
`;

const PeriodCounter = styled.div`
  color: ${$blueColor};
  font-size: 14px;
  font-weight: 400;
`;

const NavButtons = styled.div`
  display: flex;
  gap: 8px;
`;


const NavigationButton = styled.button<{ $isDisabled: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$isDisabled ? 'auto' : 'pointer'};
  position: relative;
  border: 1px solid rgba(66, 86, 122, 0.5);
  opacity: ${props => props.$isDisabled ? 0.5 : 1};
  pointer-events: ${props => props.$isDisabled ? 'none' : 'auto'};
  transition: opacity 0.3s ease;
  
  &::after {
    content: '';
    width: 7px;
    height: 7px;
    border-right: 2px solid #42567A;
    border-bottom: 2px solid #42567A;
  }
  
  @media (max-width: ${$phoneWidth}) {
    width: 30px;
    height: 30px;
  }
`;

const PrevButton = styled(NavigationButton)`
  &::after {
    transform: rotate(135deg);
    margin-right: -2px;
  }
`;

const NextButton = styled(NavigationButton)`
  &::after {
    transform: rotate(-45deg);
    margin-left: -2px;
  }
`;

const MobilePagination = styled.div`
  display: none;
  gap: 8px;

  @media screen and (max-width: ${$phoneWidth}) {
    display: flex;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

interface PaginationDotProps {
  $isActive: boolean;
}

const PaginationDot = styled.div<PaginationDotProps>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${$blueColor};
  opacity: ${props => props.$isActive ? 1 : 0.3};
  cursor: pointer;
  transition: opacity 0.3s ease;
`;

export default HistoryBlock;