import React, { useEffect, useState } from 'react';
import { Button, Rate } from 'antd';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/numeral';
import { IMAGE_PATH } from '../components/left_menu_style/menu_list';
import Modifiers from '../components/modifier';
import { LeftOutlined, SendOutlined } from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import type { Swiper as SwiperType } from 'swiper';

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
}

export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

const ProductDetail: React.FC<ProductDetailProps> = ({ currency, item }) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedAddIns, setSelectedAddIns] = useState<Modifier[]>([]);
  const [selectedOption, setSelectionOption] = useState<SelectedOption>({
    _id: null,
  });
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const modifiers = item?.modifiers || [];
  const [total, setTotal] = useState(0);
  useEffect(() =>{
   console.log(IMAGE_PATH);
  })
  useEffect(() => {
    if (item?.itemData?.variations) {
      setSelectionOption(item.itemData.variations[0]);
    }
  }, [item]);

  const handleClick = () => {
    setQuantity(0);
    setSelectedAddIns([]);
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
      selectedAddIns.reduce(
        (sum, modifier) => sum + (modifier.price || 0),
        0
      ) || 0;
    const myTotal = (basePrice + modifierCost) * quantity;
    setTotal(myTotal);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedAddIns, selectedOption, quantity]);

  const optionRender = (variations: SelectedOption[]) => {
    if (variations?.length < 2) {
      return null;
    }
    return (
      <div className="mb-4 bg-white pt-1 pb-2 dark:bg-slate-900">
        <h3 className="ml-4 text-lg font-semibold dark:text-white">Options</h3>
        <div className="ml-5 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap dark:bg-slate-900">
          {variations?.map((value: any) => (
            <Button
              key={value._id}
              onClick={() => onClickItem(value)}
              size="large"
              className={`${
                selectedOption?._id === value?._id
                  ? 'border-violet-800 !font-semibold text-violet-800 dark:border-none dark:bg-violet-700 dark:text-white dark:hover:!text-white'
                  : 'border-gray-400 text-gray-800 dark:border-gray-700'
              } !rounded-md border bg-white hover:border-violet-800 hover:text-violet-800 dark:border dark:bg-slate-900 dark:text-white dark:hover:!border-gray-600 dark:hover:!text-white sm:px-6`}
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
    handleClick();
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
  };

  return (
    <div className="relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-2">
        <Button
          className="float-left flex items-center justify-center border-none !p-5 text-2xl shadow-none hover:text-black active:!border-none active:outline-none dark:bg-black dark:hover:!text-white sm:text-2xl"
          onClick={() => {
            setQuantity(0);
          }}
        >
          <LeftOutlined/>
        </Button>
        <div className="mr-16 flex w-full items-center justify-center">
          <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
            Product Details
          </h2>
        </div>
      </header>

      {/* Product Details Section */}
      <section className="py-4 relative sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Product Details */}
            <div className="pro-detail w-full flex flex-col justify-center order-last lg:order-none max-lg:max-w-[608px] max-lg:mx-auto">
              <h2 className="mb-2 font-manrope font-bold text-3xl leading-10 text-gray-900 dark:text-white">
                {item?.itemData?.name || 'Product Name'}
              </h2>
              <div className="flex flex-nowrap items-center justify-between gap-4 mb-6">
                {/* Price */}
                <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 dark:text-white whitespace-nowrap">
                  {formatCurrency(total, currency)}
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
                    className="flex items-center text-xl sm:text-2xl border-violet-500 text-violet-500 font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
                    onClick={increaseQuantity}
                  >
                    +
                  </Button>
                </div>
              </div>
              <p className="font-bold text-lg leading-8 text-gray-900 mb-4 dark:text-white">
                Description
              </p>
              <p className="text-gray-500 text-base font-normal mb-8">
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
              <div className="flex items-center justify-center gap-3">
                <Button
                  type="primary"
                  size="large"
                  icon={<SendOutlined />}
                  className="w-full flex !h-10 !text-lg justify-center items-center"
                  onClick={onClickAddToCart}
                >
                  Add to cart - {formatCurrency(total, currency)}
                </Button>
                <Button
                  size="large"
                  type="primary"
                  className="w-full !h-10 !text-lg flex justify-center items-center"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Image Section with Swiper */}
            <div>
              {/* Main Swiper */}
              <Swiper
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
                      alt="Product Image"
                      className="mx-auto object-cover rounded-lg shadow-lg"
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
                    <img
                      src={`https://pagedone.io/asset/uploads/${img}.png`}
                      alt="Product Thumbnail"
                      className="cursor-pointer border-2 border-gray-50 transition-all duration-500 hover:border-indigo-600 slide:border-indigo-600 object-cover rounded-lg"
                    />
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