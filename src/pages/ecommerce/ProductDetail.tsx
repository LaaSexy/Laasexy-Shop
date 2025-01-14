import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Button, Rate, Space } from 'antd';
import { CheckOutlined, LeftOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { useRouter } from 'next/router';
import type { Swiper as SwiperType } from 'swiper';
import type { CSSProperties } from 'react'; 
const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedSize, setSelectedSize] =  useState<string | null>(null);
  const [selectedColor, setSelectedColor] =  useState<string | null>(null);
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();
  const { query } = router;
  const swiperStyles = {
    '--swiper-navigation-color': '#fff',
    '--swiper-pagination-color': '#fff',
  } as CSSProperties;
  const onClickBack = () =>{
    router.push({
      pathname: '/ecommerce',
      query: {
        branch: query.branch,
      },
    });
  }
  return (
      <div className="relative">
        {/* Sticky Header */}
        <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-2">
          <Button className="float-left flex items-center justify-center border-none !p-5 text-2xl shadow-none hover:text-black active:!border-none active:outline-none dark:bg-black dark:hover:!text-white sm:text-2xl">
            <LeftOutlined onClick={onClickBack}/>
          </Button>
          <div className="mr-16 flex w-full items-center justify-center">
            <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
              Product Details
            </h2>
          </div>
        </header>
        {/* session container page */}
        <section className="py-4 relative sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
              <div className="pro-detail w-full flex flex-col justify-center order-last lg:order-none max-lg:max-w-[608px] max-lg:mx-auto">
                <h2 className="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900 dark:text-white">Yellow Summer Travel Bag</h2>
                <div className="flex flex-nowrap items-center justify-between gap-4 mb-6">
                  {/* Price */}
                  <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 sm:border-r border-gray-200 dark:text-white whitespace-nowrap">
                    $22000
                  </h6>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <Rate disabled defaultValue={4} className="text-yellow-400" />
                    <span className="pl-2 font-normal leading-7 text-gray-500 text-sm">
                      1624 reviews
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center border border-violet-500 bg-violet-100 py-1 px-1 rounded-full dark:bg-slate-800 dark:border-slate-600">
                    <Button
                      shape="circle"
                      className="flex items-center text-xl sm:text-2xl border-violet-500 text-violet-500 font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
                      onClick={() => setQuantity((prev) => (prev > 0 ? prev - 1 : 0))}
                      disabled={quantity === 0}
                    >
                      -
                    </Button>
                    <h1 className="px-2 sm:px-4 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-slate-100">
                      {quantity}
                    </h1>
                    <Button
                      shape="circle"
                      className="flex items-center text-xl sm:text-2xl border-violet-500 text-violet-500 font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
                      onClick={() => setQuantity((prev) => prev + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <p className="font-bold text-lg leading-8 text-gray-900 mb-4 dark:text-white">Description</p>
                <p className="text-gray-500 text-base font-normal mb-8">
                  The perfect companion for your next adventure! Embrace the spirit of sunny escapades with this vibrant and versatile bag designed to cater to your travel needs while adding a pop of color to your journey.
                </p>
                <div className="block w-full">
                  <p className="font-bold text-lg leading-8 text-gray-900 mb-4 dark:text-white">Color</p>
                  <div className="flex items-center justify-start gap-3 md:gap-6 relative mb-6">
                    {['#10B981', '#FBBF24', '#F43F5E', '#2563EB'].map((color, i) => (
                      <Button
                        key={i}
                        shape="circle"
                        style={{
                          backgroundColor: color,
                          borderColor: color,
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        className="hover:border-emerald-500 focus:border-emerald-500"
                        onClick={() => setSelectedColor(color)}
                      >
                        {selectedColor === color && (
                          <CheckOutlined style={{ color: 'white', fontSize: '16px', fontWeight:'bolder' }} />
                        )}
                      </Button>
                    ))}
                  </div>
                  <div className="block w-full mb-6">
                    <p className="font-bold text-lg leading-8 mb-4 text-gray-900 dark:text-white">Size</p>
                    <Space>
                      {['S', 'M', 'L', 'XL', 'XXL'].map((size, i) => (
                        <Button
                          key={i}
                          shape="circle"
                          className={`font-medium mr-3 text-lg text-gray-500 h-12 w-12 ${
                            selectedSize === size ? 'bg-violet-500 !text-white font-bold' : ''
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </Space>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                  <Button
                      type="primary"
                      size="large"
                      icon={
                        <svg
                          className="w-5 h-5 -ms-2 me-2"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4h1.5L8 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm.75-3H7.5M11 7H6.312M17 4v6m-3-3h6"
                          />
                        </svg>
                      }
                      className="w-full flex !h-10 !text-lg justify-center items-center"
                    >
                      Add to cart
                    </Button>
                    <Button 
                      size="large"
                      type="primary" className="w-full !h-10 !text-lg flex justify-center items-center">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                {/* Main Swiper */}
                <Swiper
                style={swiperStyles}
                modules={[Navigation, Thumbs]}
                loop={true}
                spaceBetween={32}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                className="product-prev mb-6"
              >
                {['1700471851', '1711514857', '1711514875', '1711514892'].map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={`https://pagedone.io/asset/uploads/${img}.png`}
                      alt="Yellow Travel Bag"
                      className="mx-auto object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
                {/* Thumbnail Swiper */}
                <Swiper
                  onSwiper={setThumbsSwiper} 
                  modules={[Navigation, Thumbs]} 
                  loop={true}
                  spaceBetween={12}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  className="product-thumb max-w-[608px] mx-auto"
                >
                  {['1700471871', '1711514930', '1700471908', '1700471925'].map((img, i) => (
                    <SwiperSlide key={i}>
                      <img src={`https://pagedone.io/asset/uploads/${img}.png`} alt="Travel Bag" className="cursor-pointer border-2 border-gray-50 transition-all duration-500 hover:border-indigo-600 slide:border-indigo-600 object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
};

export default ProductDetail;

