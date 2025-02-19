import React, { useEffect, useState } from 'react';
import { Button, Drawer, Input, Menu, message } from 'antd';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';
import MultipleSkeletons from '../components/MultipleSkeletons';
import { imagePath } from '../order/index';
import { formatCurrency } from '@/utils/numeral';
import _ from 'lodash';
import { MenuOutlined, SearchOutlined } from '@ant-design/icons';
import ProductDetail, { cartAtom } from './ProductDetail';
import { atom, useAtom } from 'jotai';
import useAuthications from '@/hooks/useAuth';
import CategoryPage from './CategoryPage';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { AppConfig } from '@/utils/AppConfig';
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
  return Math.floor(Math.random() * 100000) + '-' + Date.now();
};
const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('KH');
  const languages = [
    { name: 'KH', icon: '/assets/images/Cambodia.png', label: 'ភាសាខ្មែរ' },
    { name: 'EN', icon: '/assets/images/English.png', label: 'English' },
    { name: 'CH', icon: '/assets/images/Chinese.jpg', label: '中文' },
  ];
  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };
  const selectedLanguageIcon = languages.find(
    (lang) => lang.name === selectedLanguage
  )?.icon;
  const selectedLanguageLabel = languages.find(
    (lang) => lang.name === selectedLanguage
  )?.label;
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={toggleDropdown}
          className="inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-white hover:border"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedLanguageIcon && (
            <img
              src={selectedLanguageIcon}
              alt={selectedLanguage}
              className="h-5 w-8 sm:h-7 sm:w-10"
            />
          )}
          <span className="hidden lg:inline ml-2">
            {selectedLanguageLabel}
          </span>
          <svg
            className="-mr-1 ml-2 size-5"
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
          className="absolute right-0 z-50 mt-2 w-40 sm:w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.name}
                onClick={() => handleLanguageSelect(language.name)}
                className="flex w-full items-center justify-start px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <img
                  src={language.icon}
                  alt={language.name}
                  className="h-5 w-8"
                />
                <span className="ml-2 sm:inline">
                  {language.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
interface Item {
  itemData: {
    categories: string[];
    name: string;
    imageUrl?: string;
    variations: {
      itemVariationData: {
        priceMoney: {
          amount: number;
        };
      };
    }[];
  };
  _id: string;
}
const images = [
  '/assets/images/Banner 1.jpg',
  '/assets/images/Banner 2.jpg',
  '/assets/images/Banner 3.jpg',
  '/assets/images/Banner 4.jpg',
  '/assets/images/Banner 5.jpg',
];

const playFailSound = () => {
  const audio = new Audio('/assets/audio/error.mp3');
  audio.play().catch((error) => {
    console.error('Failed to play sound:', error);
  });
};

const Ecommerce = () => {
  const [cart] = useAtom(cartAtom);
  const [deviceId] = useAtom(deviceIdAtom);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [thumbsSwiper] = useState<SwiperType | null>(null);
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const { mutate: loginDevice } = useAuthications();
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isSubcategorySelected, setIsSubcategorySelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, initializeDeviceUuid] = useAtom(initializeDeviceUuidAtom);

  const filteredCartItems = cart.filter((item:any) => item.branchId === query.branch);
  useEffect(() => {
    if (query?.branch) {
      loginDevice({
        deviceUuid: deviceId,
        branchId: query.branch,
      });
    }
  }, [query, deviceId]);

  const debouncedSearch = _.debounce((value: string) => {
    if (value) {
      const filtered = shopV2Data?.items.filter((item: Item) =>
        item.itemData.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsSubcategorySelected(true);
    } else {
      setFilteredItems(shopV2Data?.items || []);
      setIsSubcategorySelected(false);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (deviceId === null) {
      initializeDeviceUuid();
    }
  }, [deviceId, initializeDeviceUuid]);

  useEffect(() => {
    if (shopV2Data?.items) {
      const grouped = _.groupBy(shopV2Data.items, (item: Item) => item.itemData.categories[0]);
      setGroupedItems(grouped);
    }
  }, [shopV2Data]);

  const onClickCategory = (category: any) => {
    if (!category?._id) {
      message.error("Unknown category", category?._id);
      playFailSound();
      return;
    }
    setSelectedCategory(category._id);
    setIsSubcategorySelected(true);
    const filterData: any = _.filter(shopV2Data?.items, (item: Item) => {
      return item.itemData.categories.indexOf(category._id) > -1;
    });
    setFilteredItems(filterData);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const onClose = () => {
    setVisible(false);
  };

  const goToSlide = (index: any) => {
    setActiveSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClickItem = (item: Item) => {
    setSelectedItem(item);
  };

  const handleReviewProduct = () => {
    router.push({
      pathname: '/ecommerce/Checkout',
      query: {
        branch: query.branch,
      },
    });
  };

  // const onSearch = (value: string) => {
  //   setSearchQuery(value);
  //   if (value) {
  //     const filtered = shopV2Data?.items.filter((item: Item) =>
  //       item.itemData.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setFilteredItems(filtered);
  //     setIsSubcategorySelected(true);
  //   } else {
  //     setFilteredItems(shopV2Data?.items || []);
  //     setIsSubcategorySelected(false);
  //   }
  // };

  const onCancel = () => {
    setSelectedItem(null);
  };

  const handleAllitem = () =>{
    setSelectedCategory(null);
    setIsSubcategorySelected(false);
    setSelectedItem(null);
  }

  return (
    <MultipleSkeletons loading={isFetching}>
      {shopV2Data?.subCategories?.length <= 0 ? (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600 dark:text-white">No subcategories found.</p>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="relative flex min-h-screen max-w-full flex-col bg-white dark:bg-black">
            {/* Sticky Header */}
            <header className="left-0  top-0 z-50 h-28 w-full items-center justify-between bg-violet-500 shadow-lg shadow-indigo-500/50 sm:h-48">
              <div className="flex items-center justify-between sm:mt-0 mt-2">
                <div className="flex items-center">
                  {shopV2Data?.shop?.logoUrl && (
                    <img
                      src={
                        `https://api.pointhub.io${shopV2Data?.shop?.logoUrl}` ||
                        'Default'
                      }
                      alt="Logo"
                      className="m-2 hidden size-16 rounded-md sm:block sm:size-20"
                    />
                  )}
                  <p className="my-3 ml-5 text-center text-lg text-white sm:ml-0 sm:text-left sm:text-xl md:text-2xl truncate max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                    {shopV2Data?.shop?.name || 'Logo'}
                  </p>
                </div>
                <div className="absolute inset-x-0 top-0 mt-16 flex items-center justify-center px-4 sm:hidden">
                  <Input
                    placeholder="Type your keyword..."
                    allowClear
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full max-w-[400px] text-base pl-4"
                    suffix={
                      <SearchOutlined className="cursor-pointer text-xl"/>
                    }
                  />
                </div>
                {/* Search Bar for Larger Screens */}
                <div className="hidden sm:flex items-center justify-center flex-1 mx-4">
                  <Input
                    placeholder="Type your keyword..."
                    allowClear
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full max-w-[700px] text-lg pl-4"
                    suffix={
                      <SearchOutlined className="cursor-pointer text-xl"/>
                    }
                  />
                </div>
                 {/* Language Dropdown, Cart, and Menu Button */}
                <div className="flex items-center justify-end">
                  <LanguageDropdown />
                  <button
                    type="button"
                    onClick={handleReviewProduct}
                    className="relative mr-2 inline-flex items-center rounded-lg text-center px-2 py-2 text-sm font-medium text-white hover:border sm:px-4 sm:py-2"
                  >
                    <svg
                      className="size-7 sm:size-8"
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
                    <div className="absolute -end-1 -top-0 sm:-end-0 sm:-top-1 inline-flex size-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-white">
                      {filteredCartItems.length || 0}
                    </div>
                  </button>
                  <div className="flex items-center justify-end pr-3">
                    <Button
                      type="text"
                      icon={<MenuOutlined style={{ fontSize: '22px' }} />}
                      onClick={showDrawer}
                      className="ml-2 text-white hover:!text-white sm:hidden"
                    />
                  </div>
                </div>
              </div>
              <nav className="hidden max-w-full flex-col gap-4 overflow-auto whitespace-nowrap px-5 sm:flex sm:flex-row sm:pl-5">
                <div className="flex w-full min-w-full max-w-full items-start justify-start gap-4 overflow-x-auto whitespace-nowrap sm:pl-5 sm:pr-8">
                  <ul className="relative flex flex-row items-center justify-center space-x-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    {/* Home Button */}
                    <li key="home" className="list-none">
                      <Button
                        size="large"
                        onClick={
                          handleAllitem
                        }
                        className={`my-3 flex items-center justify-center rounded-md border border-[#DBD5D5] !p-5 text-base text-white hover:!border-white hover:bg-violet-700 hover:!text-white sm:my-4 ${
                          selectedCategory === null
                            ? ' bg-violet-700 text-white hover:!text-white'
                            : 'bg-transparent'
                        }`}
                        aria-pressed={selectedCategory === null}
                      >
                        All
                      </Button>
                    </li>
                    {/* Subcategory Buttons */}
                    {shopV2Data?.subCategories?.map((subCategory: any) => (
                      <li key={subCategory._id} className="list-none">
                        <Button
                          size="large" 
                          onClick={() => {
                            onClickCategory(subCategory);
                            setSelectedItem(null);
                          }}
                          className={`my-3 flex items-center justify-center rounded-md border border-[#DBD5D5] !p-5 text-base text-white hover:!border-white hover:bg-violet-700 hover:!text-white sm:my-4 ${
                            selectedCategory === subCategory._id
                              ? ' bg-violet-700 text-white hover:!text-white'
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
                {/* Home Option */}
                <Menu.Item
                  key="home"
                  onClick={() => {
                    setSelectedCategory(null);
                    setIsSubcategorySelected(false);
                    onClose(); 
                  }}
                >
                  All
                </Menu.Item>
                {/* Subcategory Options */}
                {shopV2Data?.subCategories?.map((subCategory: any) => (
                  <Menu.Item
                    key={subCategory._id}
                    onClick={() => {
                      onClickCategory(subCategory);
                      onClose();
                    }}
                  >
                    {subCategory.name}
                  </Menu.Item>
                ))}
              </Menu>
            </Drawer>

            {selectedItem ? (
              <ProductDetail
                currency={shopV2Data?.shop?.currency}
                item={selectedItem}
                onClose={onCancel}
              />
            ) : (
              <>
                {/* Banner Scroll Section */}
                <div
                  id="default-carousel"
                  className="relative w-full"
                  data-carousel="slide"
                >
                  <div className="relative h-44 overflow-hidden sm:h-64 md:h-96">
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
                          className="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
                          alt={`Slide ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`size-3 rounded-full ${
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
                    className="group absolute start-0 top-0 z-30 ml-2 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
                    onClick={prevSlide}
                  >
                    <span className="dark:group-focus:ring-white-800/70 inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-white dark:group-hover:bg-white">
                      <svg
                        className="size-4 text-white dark:text-black rtl:rotate-180"
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
                    className="group absolute end-0 top-0 z-30 mr-2 flex h-full cursor-pointer items-center justify-center px-4 focus:outline-none"
                    onClick={nextSlide}
                  >
                    <span className="dark:group-focus:ring-white-800/70 inline-flex size-10 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-white dark:group-hover:bg-white">
                      <svg
                        className="size-4 text-white dark:text-black rtl:rotate-180"
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
                <div className='flex justify-center items-center'>

                </div>

                {/* Render CategoryPage if isSubcategorySelected is true */}
                {isSubcategorySelected ? (
                  <CategoryPage
                    currency={shopV2Data?.shop?.currency}
                    filterItems={filteredItems}
                    selectedItem={selectedItem}
                    onItemClick={onClickItem}
                    onClose={onCancel}
                    seeAll={handleAllitem}
                  />
                ) : (
                  <>
                  {/* Main Content */}
                  <main className="flex-1 px-0 sm:px-4 bg-gray-300 dark:bg-black">
                    {Object.entries(groupedItems).map(([categoryId, items]) => (
                      <div key={categoryId} className="bg-white dark:bg-slate-800 rounded-sm shadow-sm mb-4">
                        <div className="flex justify-between items-center p-4 mt-4">
                          <h3 className="text-xl font-bold dark:text-white">
                            {shopV2Data?.subCategories?.find((cat: any) => cat._id === categoryId)?.name ||
                              'Uncategorized'}
                          </h3>
                          <button
                            onClick={() => {
                              onClickCategory(shopV2Data?.subCategories?.find((cat: any) => cat._id === categoryId));
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="group relative text-lg font-bold text-violet-600 dark:text-white mr-1"
                          >
                            See All
                            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-violet-600 transition-all duration-300 group-hover:w-full dark:bg-white"></span>
                          </button>
                        </div>
                        <div className="w-full overflow-hidden bg-white dark:bg-slate-800">
                          <div className="relative w-full pb-4">
                            <Swiper
                              modules={[Navigation, Thumbs]}
                              loop={true}
                              spaceBetween={16}
                              navigation={true}
                              thumbs={{ swiper: thumbsSwiper }}
                              className="product-prev"
                              breakpoints={{
                                320: {
                                  slidesPerView: 2,
                                  spaceBetween: 4,
                                },
                                768: {
                                  slidesPerView: 3,
                                  spaceBetween: 16,
                                },
                                1024: {
                                  slidesPerView: 4,
                                  spaceBetween: 16,
                                },
                                1280: {
                                  slidesPerView: 5,
                                  spaceBetween: 16,
                                },
                                1440: {
                                  slidesPerView: 5,
                                  spaceBetween: 20,
                                },
                                1600: {
                                  slidesPerView: 5,
                                  spaceBetween: 24,
                                },
                                1920: {
                                  slidesPerView: 5,
                                  spaceBetween: 32,
                                },
                              }}
                            >
                              {items.map((item: Item) => (
                                <SwiperSlide key={item._id}>
                                  <div
                                    onClick={() => { onClickItem(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    className="w-[170px] ml-5 flex-none rounded-lg no-underline hover:no-underline hover:border-transparent bg-white text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-slate-900 sm:w-[250px] cursor-pointer"
                                  >
                                    <img
                                      alt={item?.itemData?.name || 'Product Image'}
                                      src={
                                        item?.itemData?.imageUrl
                                          ? `${imagePath}${item.itemData.imageUrl}`
                                          : '/placeholder-image.jpg'
                                      }
                                      className="mx-auto mb-4 h-[155px] w-[165px] rounded-md object-cover sm:h-[210px] sm:w-[240px] transition duration-300 ease-in-out hover:scale-105"
                                    />
                                    <div className="mx-2 mb-5">
                                      <h2 className="mb-2 text-start text-sm text-black dark:text-white">
                                        {item?.itemData?.name || 'Unnamed Product'}
                                      </h2>
                                      <div className="flex items-center justify-between">
                                        <h5 className="mt-2 text-lg font-bold text-violet-700 dark:text-white mb-4">
                                          {formatCurrency(
                                            item?.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || 0,
                                            shopV2Data?.shop?.currency
                                          )}
                                        </h5>
                                        <Button
                                          onClick={(e) => {
                                            e.preventDefault();
                                          }}
                                          className="mt-2 mb-4 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white"
                                        >
                                          <img
                                            src="/assets/images/add-to-cart.png"
                                            alt="Add to Cart Icon"
                                            className="size-4"
                                          />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                          </div>
                        </div>
                      </div>
                    ))}
                  </main>
                  </>
                )}
              </>
            )} 
            <div className="absolute bottom-96 sm:bottom-72 right-4 flex items-center">
              <Button 
                onClick={() => {window.scrollTo({ top: 0, behavior: 'smooth' });}} 
                type="primary" className="h-10 w-10 sm:mt-5 mt-0 sm:h-12 sm:w-12 flex !justify-center !items-center rounded-full bg-violet-600 hover:bg-violet-700" 
                shape='circle'
              >
                <svg 
                  className="w-6 h-6 text-white dark:text-white" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  fill="none" 
                  viewBox="0 0 24 24">
                  <path 
                    stroke="currentColor" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" d="m5 15 7-7 7 7"
                  />
                </svg>
              </Button>
            </div>
            {/* footer Content */}
            <footer>
              <div className="bg-gray-900">
                <div className="mx-auto max-w-2xl py-10 text-white">
                  <div className="text-center">
                    <h3 className="mb-3 text-3xl">
                      Shop the latest trends and products with us.
                    </h3>
                    <p>
                      Point hub POS is user-friendly and easy to navigate, making
                      it accessible for business owners and staff of all technical
                      levels.
                    </p>
                    <div className="my-10 flex justify-center">
                      <button
                        onClick={() =>
                          window.open(
                            'https://play.google.com/store/apps/details?id=io.pointhub.merchant&hl=km',
                            '_blank'
                          )
                        }
                      >
                        <div className="mx-2 flex cursor-pointer items-center rounded-lg border px-4 py-2 transition-colors duration-300 hover:bg-gray-800">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/888/888857.png"
                            alt="Google Play Store"
                            className="w-7 md:w-8"
                          />
                          <div className="ml-3 text-left">
                            <p className="text-xs text-gray-200">Download on</p>
                            <p className="text-sm text-gray-200 md:text-base">
                              Google Play Store
                            </p>
                          </div>
                        </div>
                      </button>
                      <button
                        onClick={() =>
                          window.open(
                            'https://apps.apple.com/us/app/point-hub-pos-point-of-sale/id1472932126',
                            '_blank'
                          )
                        }
                      >
                        <div className="mx-2 flex w-44 cursor-pointer items-center rounded-lg border px-4 py-2 transition-colors duration-300 hover:bg-gray-800">
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/888/888841.png"
                            alt="Apple Store"
                            className="w-7 md:w-8"
                          />
                          <div className="ml-3 text-left">
                            <p className="text-xs text-gray-200">Download on</p>
                            <p className="text-sm md:text-base">Apple Store</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-sm text-gray-400 md:flex-row md:justify-between">
                    <p className="order-2 hover:text-white md:order-1 md:mt-0">
                      © 2022 {AppConfig.title}.<br /> Powered with{' '}
                      <span role="img" aria-label="Love">
                        ♥
                      </span>{' '}
                      by <a href="https://www.pointhub.io">Point hub</a>
                    </p>
                    <div className="order-1 md:order-2">
                      <span className="cursor-pointer px-2 transition-colors duration-300 hover:text-white">
                        About us
                      </span>
                      <span className="cursor-pointer border-l px-2 transition-colors duration-300 hover:text-white">
                        Contact us
                      </span>
                      <span className="cursor-pointer border-l px-2 transition-colors duration-300 hover:text-white">
                        Privacy Policy
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      )}
    </MultipleSkeletons>
  );
};

export default Ecommerce;