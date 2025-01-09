import React, { useEffect, useRef, useState } from 'react';
import { Button, Drawer, Input, Menu} from 'antd';
import { atom, useAtom } from 'jotai';
import _ from 'lodash';
import { useRouter } from 'next/router';
import useAuthications from '@/hooks/useAuth';
import useOrderSessionId from '@/hooks/useCheckOut';
import { useV2Items } from '@/hooks/useItems';
import useSession, { sessionAtom } from '@/hooks/useSession';
import { Item } from '@/types/Item';
import ItemDetailModal, { cartAtom } from './components/ItemDetailModal';
import MultipleSkeletons from './components/MultipleSkeletons';
import { formatCurrency } from '@/utils/numeral';
import { MenuOutlined } from '@ant-design/icons';

export const imagePath = 'https://api.pointhub.io';
export const deviceIdAtom = atom<string | null>(null);
export const initializeDeviceUuidAtom = atom(null, (get, set) => {
  const currentDeviceId = get(deviceIdAtom);
  console.log(currentDeviceId);
  const storedUuid = localStorage.getItem('deviceId');
  if (storedUuid) {
    set(deviceIdAtom, storedUuid);
  } else {
    const newDeviceId = generateDeviceId();
    localStorage.setItem('deviceId', newDeviceId);
    set(deviceIdAtom, newDeviceId);
  }
});

export const generateDeviceId = () => {
  return Math.floor(Math.random() * 100000) + "-" + Date.now();
};
import type { GetProps } from 'antd';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps['onSearch'] = (value:any, _e:any, info:any) => console.log(info?.source, value);
// LanguageDropdown Component
const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('KH');
  const languages = [
    { name: 'KH', icon: '/assets/images/Cambodia.png' },
    { name: 'EN', icon: '/assets/images/English.png' },
    { name: 'CH', icon: '/assets/images/Chinese.jpg' },
  ];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };
  const selectedLanguageIcon = languages.find(
    (lang) => lang.name === selectedLanguage
  )?.icon;
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex items-center py-3 hover:border justify-center w-full rounded-md px-4 text-sm font-medium text-white"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedLanguageIcon && (
            <img
              src={selectedLanguageIcon}
              alt={selectedLanguage}
              className="w-8 h-5 mr-2"
            />
          )}
          {selectedLanguage}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      {isOpen && (
        <div
          className="origin-top-right z-50 absolute right-0 mt-2 w-56 rounded-md shadow-lg  bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.name}
                onClick={() => handleLanguageSelect(language.name)}
                className="text-gray-700 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center"
                role="menuitem"
              >
                <img
                  src={language.icon}
                  alt={language.name}
                  className="w-8 h-5 mr-2"
                />
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


const Ecommerce = () => {
  const [cart] = useAtom(cartAtom);
  const [deviceId] = useAtom(deviceIdAtom);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [session] = useAtom(sessionAtom);
  const [ ,setItems] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const { mutate, data } = useOrderSessionId();
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const { mutate: loginDevice, isSuccess } = useAuthications();
  const { mutate: createSession } = useSession();
  const [, initializeDeviceUuid] = useAtom(initializeDeviceUuidAtom);
  const [visible, setVisible] = useState(false);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const popularProductsScrollRef = useRef<HTMLDivElement>(null);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const item = data?.flatMap((value: any) => value.items) || [];
    setItems(item);
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      mutate({ sessionId: session?._id || '' });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess) {
      createSession();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (deviceId === null) {
      initializeDeviceUuid();
    }
  }, [deviceId, initializeDeviceUuid]);

  useEffect(() => {
    if (query?.branch) {
      loginDevice({
        deviceUuid: deviceId,
        branchId: query.branch,
        tableNumber: query.table,
      });
    }
  }, [query, deviceId]);

  useEffect(() => {
    if (shopV2Data?.subCategories) {
      onClickCategory(shopV2Data?.subCategories?.[0]);
    }
  }, [shopV2Data]);

  const onClickCategory = (category: any) => {
    setSelectedCategory(category._id);
    const filterData: any = _.filter(shopV2Data?.items, (item: Item) => {
      return item.itemData.categories.indexOf(category._id) > -1;
    });
    setFilteredItems(filterData);
  };

  // Array of image URLs
  const images = [
    '/assets/images/Banner 1.jpg',
    '/assets/images/Banner 2.jpg',
    '/assets/images/Banner 3.jpg',
    '/assets/images/Banner 4.jpg',
    '/assets/images/Banner 5.jpg',
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index:any) => {
    setActiveSlide(index);
  };


  const scrollLeft = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: -200,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: 200,
        behavior: 'smooth',
      });
    }
  };


  return (
    <MultipleSkeletons loading={isFetching}>
      <div className="container mx-auto flex min-h-screen max-w-full flex-col">
        <div className="flex min-h-screen flex-col bg-[#e8e4e4] dark:bg-black">
          <header className="sticky top-0 z-50 left-0 w-full items-center h-32 sm:h-48 justify-between bg-violet-500 shadow-lg shadow-indigo-500/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {shopV2Data?.shop?.logoUrl && (
                  <img
                    src={
                      `https://api.pointhub.io${shopV2Data?.shop?.logoUrl}` ||
                      'Default'
                    }
                    alt="Logo"
                    className="mx-2 size-16 rounded-md my-2 sm:size-20 hidden sm:block"
                  />
                )}
                <p className="my-3 text-center text-xl text-white sm:text-2xl ml-5 sm:ml-0">
                  {shopV2Data?.shop?.name || 'Logo'}
                </p>
              </div>
              <div className="flex items-center justify-center sm:hidden absolute top-0 left-0 right-0 mt-16 pl-4 pr-4">
                <Search
                  placeholder="Type your keyword..."
                  allowClear
                  size="large"
                  onSearch={onSearch}
                  className="w-[500px] sm:w-[300px] mr-4"
                />
              </div>
              <div className="hidden sm:flex justify-center items-center">
                <Search
                  placeholder="Type your keyword..."
                  allowClear
                  size="large"
                  onSearch={onSearch}
                  className="w-full sm:w-[700px]"
                />
              </div>
              <div className="flex items-center justify-end">
                <LanguageDropdown />
                <button type="button" className="relative mr-2 inline-flex items-center text-sm font-medium text-center text-white rounded-lg">
                  <svg
                    className="w-7 h-7"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
                    />
                  </svg>
                  <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold dark:border-white text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2">{cart.length || 0}</div>
                </button>
                <div className="flex justify-end items-center pr-6">
                  <Button
                    type="text"
                    icon={<MenuOutlined style={{ fontSize: '22px' }} />} 
                    onClick={showDrawer}
                    className="sm:hidden text-white hover:!text-white ml-2"
                  />
                </div>
              </div>
            </div>
            <nav className="hidden sm:flex max-w-full flex-col gap-4 overflow-auto whitespace-nowrap pl-4 pr-4 sm:flex-row sm:pl-5">
              <div className="flex w-full min-w-full max-w-full items-start justify-start gap-4 overflow-x-auto whitespace-nowrap sm:pl-5">
                <ul className="relative flex flex-row items-center justify-center space-x-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  {shopV2Data?.subCategories?.map((subCategory: any) => (
                    <li key={subCategory._id} className="list-none">
                      <Button
                        size='large'
                        onClick={() => onClickCategory(subCategory)}
                        className={`my-3 rounded-md border flex justify-center text-white items-center !p-5 border-[#DBD5D5] px-4 py-4 hover:!border-white hover:!text-white hover:bg-violet-500 text-base sm:my-4 ${
                          selectedCategory === subCategory._id
                            ? ' bg-purple-400 text-white hover:!text-white'
                            : 'bg-transparent'
                        }`}
                        aria-pressed={selectedCategory === subCategory._id}
                      >
                        {subCategory.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </header>
          
          <Drawer
            title="Menu"
            placement="right"
            onClose={onClose}
            visible={visible}
          >
            <Menu mode="vertical" className="text-base">
              {shopV2Data?.subCategories?.map((subCategory: any) => (
                <Menu.Item key={subCategory._id} onClick={() => onClickCategory(subCategory)}>
                  {subCategory.name}
                </Menu.Item>
              ))}
            </Menu>
          </Drawer>
          {/* Banner Scroll Section */}
          <div id="default-carousel" className="relative w-full mt-3 sm:mt-5" data-carousel="slide">
            <div className="relative h-44 mx-4 overflow-hidden sm:h-96">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    index === activeSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  data-carousel-item
                >
                  <img
                    src={image}
                    className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`w-3 h-3 rounded-full ${
                    index === activeSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-current={index === activeSlide}
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                ></button>
              ))}
            </div>
            <button
              type="button"
              className="absolute ml-2 top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={prevSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white group-hover:bg-white/50 dark:group-hover:bg-white group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-white-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-black rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
                <span className="sr-only">Previous</span>
              </span>
            </button>
            <button
              type="button"
              className="absolute top-0 mr-2 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
              onClick={nextSlide}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-white group-hover:bg-white/50 dark:group-hover:bg-white group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-white-800/70 group-focus:outline-none">
                <svg
                  className="w-4 h-4 text-white dark:text-black rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 9 4-4-4-4"
                  />
                </svg>
                <span className="sr-only">Next</span>
              </span>
            </button>
          </div>

          {/* Categories Section */}
          {filteredItems.length > 0 && (
            <div className="overflow-hidden bg-white dark:bg-slate-800 mx-4 mt-3 sm:mt-5">
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-lg font-bold text-black dark:text-white">Categories</h2>
                <button className="text-lg font-bold text-violet-600 dark:text-white relative group">
                  See All
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-violet-600 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
              <div className="relative w-full px-2 pb-4">
                <Button
                  onClick={() => scrollLeft(categoriesScrollRef)}
                  className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                    filteredItems.length <= 14 ? 'hidden' : 'block'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <svg
                    className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </Button>
                <div
                  ref={categoriesScrollRef}
                  className="w-full px-4 overflow-x-auto overflow-y-hidden py-1 flex flex-nowrap space-x-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredItems.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex-none rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white text-center dark:bg-slate-900"
                      style={{ width: '120px' }}
                    >
                      <img
                        alt={item?.itemData?.name || 'Product Image'}
                        src={
                          item?.itemData?.imageUrl
                            ? `${imagePath}${item?.itemData.imageUrl}`
                            : '/placeholder-image.jpg'
                        }
                        className="mx-auto mt-1 mb-2 size-28 rounded-md object-cover"
                      />
                      <h2 className="mx-2 text-center text-sm text-black dark:text-white">
                        {item?.itemData?.name || 'Unnamed Product'}
                      </h2>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => scrollRight(categoriesScrollRef)}
                  className={`absolute mr-2 right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                    filteredItems.length <= 14 ? 'hidden' : 'block'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <svg
                    className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Products Section */}
          {filteredItems.length > 0 && (
            <div className="overflow-hidden bg-white dark:bg-slate-800 mx-4 mt-3 sm:mt-5">
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-lg font-bold text-black dark:text-white">Product</h2>
                <button className="text-lg font-bold text-violet-600 dark:text-white relative group">
                  See All
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-violet-600 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
              <div className="relative w-full px-2 pb-4">
                <Button
                  onClick={() => scrollLeft(productsScrollRef)}
                  className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                    filteredItems.length <= 7 ? 'hidden' : 'block'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <svg
                    className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </Button>
                <div
                  ref={productsScrollRef}
                  className="w-full px-4 overflow-x-auto overflow-y-hidden py-1 flex flex-nowrap space-x-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredItems.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex-none w-[190px] sm:w-[250px] rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white text-center dark:bg-slate-900"
                    >
                      <img
                        alt={item?.itemData?.name || 'Product Image'}
                        src={
                          item?.itemData?.imageUrl
                            ? `${imagePath}${item?.itemData.imageUrl}`
                            : '/placeholder-image.jpg'
                        }
                        className="mx-auto mb-4 mt-1 rounded-md h-[160px] w-[180px] object-cover sm:h-[210px] sm:w-[240px]"
                      />
                      <div className="mx-2 mb-4">
                        <h2 className="mb-2 text-start text-sm text-black dark:text-white">
                          {item?.itemData?.name || 'Unnamed Product'}
                        </h2>
                        <div className="flex items-center justify-between">
                          <h5 className="mt-2 text-lg font-bold text-violet-700 dark:text-white">
                            {formatCurrency(
                              item?.itemData?.variations?.[0]?.itemVariationData
                                ?.priceMoney?.amount || 0,
                              shopV2Data?.shop?.currency
                            )}
                          </h5>
                          <Button className="mt-2 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white">
                            <img
                              src="/assets/images/add-to-cart.png"
                              alt="Add to Cart Icon"
                              className="size-4"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => scrollRight(productsScrollRef)}
                  className={`absolute mr-2 right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                    filteredItems.length <= 7 ? 'hidden' : 'block'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <svg
                    className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}

          {/* Popular Product Section */}
          {filteredItems.length > 0 && (
            <div className="overflow-hidden bg-white dark:bg-slate-800 mx-4 mt-3 sm:mt-5">
              <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-lg font-bold text-black dark:text-white">Popular Product</h2>
                <button className="text-lg font-bold text-violet-600 dark:text-white relative group">
                  See All
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-violet-600 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
              <div className="relative w-full px-2 pb-4">
              <Button
                onClick={() => scrollLeft(popularProductsScrollRef)}
                className={`absolute ml-2 left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                  filteredItems.length <= 7 ? 'hidden' : 'block'
                }`}
                style={{ transform: 'translateY(-50%)' }}
              >
                <svg
                  className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </Button>
                <div
                  ref={popularProductsScrollRef}
                  className="w-full px-4 overflow-x-auto overflow-y-hidden py-1 flex flex-nowrap space-x-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredItems.map((item: any) => (
                    <div
                      key={item._id}
                      className="flex-none w-[190px] sm:w-[250px] rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white text-center dark:bg-slate-900"
                    >
                      <img
                        alt={item?.itemData?.name || 'Product Image'}
                        src={
                          item?.itemData?.imageUrl
                            ? `${imagePath}${item?.itemData.imageUrl}`
                            : '/placeholder-image.jpg'
                        }
                        className="mx-auto mb-4 mt-1 rounded-md h-[160px] w-[180px] object-cover sm:h-[210px] sm:w-[240px]"
                      />
                      <div className="mx-2 mb-4">
                        <h2 className="mb-2 text-start text-sm text-black dark:text-white">
                          {item?.itemData?.name || 'Unnamed Product'}
                        </h2>
                        <div className="flex items-center justify-between">
                          <h5 className="mt-2 text-lg font-bold text-violet-700 dark:text-white">
                            {formatCurrency(
                              item?.itemData?.variations?.[0]?.itemVariationData
                                ?.priceMoney?.amount || 0,
                              shopV2Data?.shop?.currency
                            )}
                          </h5>
                          <Button className="mt-2 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white">
                            <img
                              src="/assets/images/add-to-cart.png"
                              alt="Add to Cart Icon"
                              className="size-4"
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => scrollRight(popularProductsScrollRef)}
                  className={`absolute mr-2 right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center z-10 ${
                    filteredItems.length <= 7 ? 'hidden' : 'block'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  <svg
                    className="w-4 h-4 text-black dark:text-black rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          )}
          <footer>
            <div className="bg-violet-500">
              <div className="max-w-2xl mx-auto text-white py-10">
                <div className="text-center">
                  <h3 className="text-3xl mb-3">Download our fitness app</h3>
                  <p>Stay fit. All day, every day.</p>
                  <div className="flex justify-center my-10">
                    {/* Google Play Store Button */}
                    <div className="flex items-center border rounded-lg px-4 py-2 mx-2 cursor-pointer hover:bg-gray-800 transition-colors duration-300">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                        alt="Google Play Store"
                        className="w-7 md:w-8"
                      />
                      <div className="text-left ml-3">
                        <p className="text-xs text-gray-200">Download on</p>
                        <p className="text-sm md:text-base">Google Play Store</p>
                      </div>
                    </div>

                    {/* Apple Store Button */}
                    <div className="flex items-center border rounded-lg px-4 py-2 w-44 mx-2 cursor-pointer hover:bg-gray-800 transition-colors duration-300">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                        alt="Apple Store"
                        className="w-7 md:w-8"
                      />
                      <div className="text-left ml-3">
                        <p className="text-xs text-gray-200">Download on</p>
                        <p className="text-sm md:text-base">Apple Store</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Links and Copyright */}
                <div className="mt-28 flex flex-col md:flex-row md:justify-between items-center text-sm text-gray-400">
                  <p className="order-2 md:order-1 mt-8 md:mt-0">
                    &copy; Point Hub POS, 2021.
                  </p>
                  <div className="order-1 md:order-2">
                    <span className="px-2 hover:text-white transition-colors duration-300 cursor-pointer">
                      About us
                    </span>
                    <span className="px-2 border-l hover:text-white transition-colors duration-300 cursor-pointer">
                      Contact us
                    </span>
                    <span className="px-2 border-l hover:text-white transition-colors duration-300 cursor-pointer">
                      Privacy Policy
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </MultipleSkeletons>
  );
};
export default Ecommerce;