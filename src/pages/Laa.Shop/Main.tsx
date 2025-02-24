import React, { useEffect, useState } from 'react';
import { Button, Typography, Image, List } from 'antd';
const { Text } = Typography;

const carouselData = [
  { id: 2, src: '/assets/images/banner1.png', alt: 'Slide 1' },
  { id: 3, src: '/assets/images/banner2.png', alt: 'Slide 2' },
  { id: 1, src: '/assets/images/banner3.png', alt: 'Slide 3' },
  { id: 4, src: '/assets/images/banner4.png', alt: 'Slide 4' },
];

const gameData = [
  { id: '1', title: 'Mobile Legends', image: '/assets/images/mobileLegend.jpg', link: '' },
  { id: '2', title: 'Free Fire', image: '/assets/images/freeFire.png', link: '' },
  { id: '3', title: 'Honor of Kings', image: '/assets/images/hornorOfKing.png', link: '' },
  { id: '4', title: 'PUBG Mobile', image: '/assets/images/pubg.png', link: '' },
  { id: '5', title: 'Telegram', image: '/assets/images/Telegram.png', link: 'https://t.me/Tengchantola' },
  { id: '6', title: 'TikTok', image: '/assets/images/Tiktok.png', link: 'https://www.tiktok.com/@laa.sexy0' },
];

const Main = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // const handlePrev = () => {
  //   setActiveIndex((prevIndex) => (prevIndex === 0 ? carouselData.length - 1 : prevIndex - 1));
  // };

  // const handleNext = () => {
  //   setActiveIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
  // };

  return (
    <div className="bg-[url('/assets/images/Background1.jpg')] bg-cover bg-center min-h-screen flex flex-col">
      {/* Carousel */}
      <div className="relative w-full max-w-7xl mx-auto px-4 pt-8 pb-12 sm:mt-16 mt-10 sm:mb-52 mb-20">
        {carouselData.map((item, index) => (
          <div
            key={item.id}
            className={`absolute mx-5 sm:mx-0 inset-0 transition-opacity duration-700 ease-in-out  ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              preview={false}
              className="w-full h-full object-cover sm:rounded-3xl rounded-xl"
            />
          </div>
        ))}
        {/* <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
          </svg>
        </button> */}
      </div>
  
      {/* Game List */}
      <div className="w-full flex-1 flex items-center justify-center px-4 pb-8 sm:pt-14 mt-0">
        <List
          grid={{
            gutter: 16,
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
            xl: 6,
          }}
          dataSource={gameData}
          className="w-full max-w-6xl"
          renderItem={(item) => (
            <List.Item className="flex justify-center items-center mx-7 sm:mx-2">
              <div className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl shadow-lg mb-5 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Button
                  type="text"
                  onClick={() => item.link && window.open(item.link, '_blank')}
                  className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 !text-white "
                >
                  <div className="w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      preview={false}
                      height={120}
                      className="rounded-lg object-cover w-full h-[120px] sm:h-[140px]"
                    />
                  </div>
                  <Text className="text-white text-xs sm:text-sm text-center font-semibold mt-2 sm:mt-3 px-2 line-clamp-2">
                    {item.title}
                  </Text>
                </Button>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Main;