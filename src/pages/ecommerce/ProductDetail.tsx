import React, { useEffect, useState } from 'react';
import { Button, message  } from 'antd';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/numeral';
import { IMAGE_PATH } from '../components/left_menu_style/menu_list';
import Modifiers from '../components/modifierEcommerce';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Swiper as SwiperType } from 'swiper';
import { useV2Items } from '@/hooks/useItems';
import { useRouter } from 'next/router';
import MultipleSkeletons from '../components/MultipleSkeletons';

interface SelectedOption {
  _id: string | null;
  itemVariationData?: {
    priceMoney?: {
      amount: number;
    };
    name: string;
  };
}

interface Modifier {
  price: number;
}

interface CartItem {
  id: string;
  modifiers: number[];
  total: number;
  quantity: number;
  price?: number;
  variation: SelectedOption;
}

interface ProductDetailProps {
  currency: string;
  item: any;
  onClose: () => void;
}

export const cartAtom = atomWithStorage<CartItem[]>('cart', []);
const playSuccessSound = () => {
  const audio = new Audio('/assets/audio/orderSucess.mp3');
  audio.play().catch((error) => {
    console.error('Failed to play sound:', error);
  });
};

const ProductDetail: React.FC<ProductDetailProps> = ({ currency, item, onClose }) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedAddIns, setSelectedAddIns] = useState<Modifier[]>([]);
  const [selectedOption, setSelectionOption] = useState<SelectedOption>({
    _id: null,
  });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const modifiers = item?.modifiers || [];
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);

  useEffect(() => {
    console.log(IMAGE_PATH);
    console.log(`item: ${JSON.stringify(item)}`);
  }, [item]);

  useEffect(() => {
    if (item?.itemData?.variations) {
      setSelectionOption(item.itemData.variations[0]);
    }
  }, [item]);

  const handleClick = () => {
    setQuantity(0);
    setSelectedAddIns([]);
    setSelectionOption({ _id: null });
  };

  const onClickItem = (option: SelectedOption) => {
    setSelectionOption(option);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const calculateTotalPrice = () => {
    const basePrice =
      selectedOption?.itemVariationData?.priceMoney?.amount || 0;
    const modifierCost =
      selectedAddIns.reduce((sum, modifier) => sum + (modifier.price || 0), 0) ||
      0;
    const myTotal = (basePrice + modifierCost) * quantity;
    setTotal(myTotal);
  };

  // const handleImageClick = (value: any) => {
  //   console.log('Hello');
  //   setSelectionOption(value);
  // };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedAddIns, selectedOption, quantity]);

  const optionRender = (variations: SelectedOption[]) => {
    if (variations?.length < 2) {
      return null;
    }
    return (
      <div className="mb-4 bg-white pt-1 pb-2 dark:bg-black">
        <h3 className="text-lg font-semibold dark:text-white">Options</h3>
        <div className="flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap dark:bg-black">
          {variations?.map((value: any) => (
            <Button
              key={value._id}
              onClick={() => onClickItem(value)}
              size="large"
              className={`${
                selectedOption?._id === value?._id
                  ? 'border-violet-800 !font-semibold text-violet-800 dark:border-none dark:bg-violet-700 dark:text-white dark:hover:!text-white'
                  : 'border-gray-400 text-gray-800 dark:border-gray-700'
              } !rounded-full border bg-white hover:border-violet-800 hover:text-violet-800 dark:border dark:bg-slate-800 dark:text-white dark:hover:!border-gray-600 dark:hover:!text-white sm:px-6`}
            >
              {`${value?.itemVariationData?.name} - ${formatCurrency(
                value?.itemVariationData?.priceMoney?.amount,
                currency
              )}`}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  const onClickAddToCart = () => {
    const deviceUuid = uuidv4();
    const name =
      item?.itemData?.variations?.length < 2
        ? item?.itemData?.name || ''
        : `${item?.itemData?.name || ''}${
            selectedOption?.itemVariationData?.name
              ? ` (${selectedOption.itemVariationData.name})`
              : ''
          }`.trim();
    const myItem = {
      ...item,
      name,
      modifiers: selectedAddIns,
      id: deviceUuid,
      selectedAddIns,
      total,
      quantity,
      price: selectedOption?.itemVariationData?.priceMoney?.amount,
      variation: selectedOption,
    };
    setCart([...cart, myItem]);
    handleClick();
    onClose();
    message.success({
      content: 'Order added successfully!',
      duration: 3,
    });
     playSuccessSound();
  };

  // const onClickBuyNow = () =>{
  //   const deviceUuid = uuidv4();
  //   const name =
  //     item?.itemData?.variations?.length < 2
  //       ? item?.itemData?.name || ''
  //       : `${item?.itemData?.name || ''}${
  //           selectedOption?.itemVariationData?.name
  //             ? ` (${selectedOption.itemVariationData.name})`
  //             : ''
  //         }`.trim();
  //   const myItem = {
  //     ...item,
  //     name,
  //     modifiers: selectedAddIns,
  //     id: deviceUuid,
  //     selectedAddIns,
  //     total,
  //     quantity,
  //     price: selectedOption?.itemVariationData?.priceMoney?.amount,
  //     variation: selectedOption,
  //   };
  //   setCart([...cart, myItem]);
  //   handleClick();
  //   onClose();
  //   if (query?.branch) {
  //     router.push({
  //       pathname: '/ecommerce/Checkout',
  //       query: {
  //         branch: query.branch,
  //       },
  //     });
  //   }
  // }

  return (
    <MultipleSkeletons loading={isFetching}>
        <div className="relative">
          {/* Product Details Section */}
          <section className="py-4 relative sm:py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Product Details */}
                <div className="pro-detail w-full flex flex-col justify-center order-last lg:order-none max-lg:max-w-[608px] max-lg:mx-auto">
                  {item?.itemData?.variations?.length < 2 ? (
                    <h2 className="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900 dark:text-white">
                      {item?.itemData?.name || ''}
                    </h2>
                  ) : (
                    <h2 className="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900 dark:text-white">
                      {`${item?.itemData?.name || ''}${
                        selectedOption?.itemVariationData?.name
                          ? ` (${selectedOption.itemVariationData.name})`
                          : ''
                      }`.trim()}
                    </h2>
                  )}
                  <div className="flex flex-nowrap items-center justify-between gap-4 mb-4">
                    <h6 className="font-manrope font-semibold text-2xl leading-9 text-violet-700 dark:text-white whitespace-nowrap">
                      {formatCurrency(
                        item?.itemData?.variations?.length > 1
                          ? selectedOption?.itemVariationData?.priceMoney?.amount
                          : item?.itemData?.variations?.[0]?.itemVariationData
                              ?.priceMoney?.amount || 0,
                        shopV2Data?.shop?.currency
                      )}
                    </h6>

                    {/* Rating and Reviews */}
                    {/* <div className="flex items-center gap-2 whitespace-nowrap">
                      <Rate disabled defaultValue={4} className="text-yellow-400" />
                      <span className="pl-2 font-normal leading-7 text-gray-500 text-sm">
                        1624 reviews
                      </span>
                    </div> */}

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-violet-500 bg-violet-100 py-1 px-1 rounded-full dark:bg-slate-800 dark:border-slate-600">
                      <Button
                        shape="circle"
                        className="flex items-center text-xl sm:text-2xl border-violet-500 text-violet-500 font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
                        onClick={decreaseQuantity}
                        disabled={quantity === 0}
                      >
                        -
                      </Button>
                      <h1 className="px-2 sm:px-4 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-slate-100">
                        {quantity}
                      </h1>
                      <Button
                        shape="circle"
                        className="flex items-center text-xl sm:text-2xl border-violet-500 bg-violet-500 text-white font-semibold hover:!text-white justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
                        onClick={increaseQuantity}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">
                    Description
                  </p>
                  <p className="text-gray-800 dark:text-white text-base font-normal mb-6">
                    {item?.itemData?.description || 'Product description goes here.'}
                  </p>
                  {optionRender(item?.itemData?.variations)}
                  {/* Modifiers Section */}
                  <div className="block w-full">
                    {modifiers.length > 0 && (
                      <Modifiers
                        onChanged={setSelectedAddIns}
                        selectedVariation={selectedOption}
                        data={modifiers}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <Button
                      type="primary"
                      size="large"
                      className={`w-full flex !text-xl !p-6 !rounded-full justify-center items-center${
                        quantity <= 0 || total <= 0
                          ? 'cursor-not-allowed opacity-60 flex justify-center items-center'
                          : ''
                      }`}
                      disabled={quantity <= 0 || total <= 0}
                      onClick={onClickAddToCart}
                    >
                      <svg
                        className="-ms-2 me-2 h-6 w-6"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Add to cart - {formatCurrency(total, currency)}
                    </Button>
                    {/* <Button
                      type="primary"
                      size="large"
                      className={`w-full flex !text-lg !p-5 justify-center items-center${
                        quantity <= 0 || total <= 0
                          ? 'cursor-not-allowed opacity-60 flex justify-center items-center'
                          : ''
                      }`}
                      disabled={quantity <= 0  || total <= 0}
                      onClick={onClickBuyNow}
                    >
                      <svg
                        className="-ms-2 me-2 h-5 w-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                        />
                      </svg>
                      Buy Now
                    </Button> */}
                  </div>
                </div>
                {/* Image Section with Swiper */}
                <div>
                  <Swiper
                    modules={[Navigation, Thumbs]}
                    loop={true}
                    spaceBetween={32}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    className="product-prev"
                  >
                    {['1700471851', '1711514857', '1711514875', '1711514892'].map(
                      (i) => (
                        <SwiperSlide key={i}>
                          <div className="mx-2 my-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg">
                            <img
                              src={
                                IMAGE_PATH +
                                (item && item.itemData
                                  ? item.itemData.imageUrl
                                  : 'default-image')
                              }
                              alt={item?.itemData?.name || 'Item'}
                              className="mx-auto object-cover rounded-lg transition duration-500"
                            />
                          </div>
                        </SwiperSlide>
                      )
                    )}
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
                    className="product-thumb max-w-[608px] mx-auto text-black"
                  >
                    {['1700471871', '1711514930', '1700471908', '1700471925'].map(
                      (i) => (
                        <SwiperSlide key={i}>
                          <div className="rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] mx-2 my-2">
                            <img
                              src={
                                IMAGE_PATH +
                                (item && item.itemData
                                  ? item.itemData.imageUrl
                                  : 'default-image')
                              }
                              alt={item?.itemData?.name || 'Item Thumbnail'}
                              className={`cursor-pointer transition-all duration-500 rounded-lg ease-in-out hover:scale-105 ${
                                selectedOption?._id === i
                                  ? 'border-violet-800 !font-semibold text-violet-800 dark:border-none dark:bg-violet-700 dark:text-white dark:hover:!text-white'
                                  : 'border-gray-400 text-gray-800 dark:border-gray-700'
                              }`}
                              // onClick={() => handleImageClick({ _id: i })}
                            />
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </div>
              </div>
            </div>
          </section>
        </div>
    </MultipleSkeletons>
  );
};

export default ProductDetail;