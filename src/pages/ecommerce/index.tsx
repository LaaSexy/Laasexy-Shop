import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Button, Drawer, Input, List, Menu } from 'antd';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';
import MultipleSkeletons from '../components/MultipleSkeletons';
import { imagePath } from '../order/index';
import { formatCurrency } from '@/utils/numeral';
import _ from 'lodash';
import { AppstoreOutlined, MenuOutlined, UnorderedListOutlined } from '@ant-design/icons';
type SearchProps = React.ComponentProps<typeof Search>;
const { Search } = Input;
const onSearch: SearchProps['onSearch'] = (value: any, _e: any, info: any) =>
  console.log(info?.source, value);
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
          className="inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-medium text-white hover:border"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {selectedLanguageIcon && (
            <img
              src={selectedLanguageIcon}
              alt={selectedLanguage}
              className="mr-2 h-5 w-8"
            />
          )}
          {selectedLanguage}
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
          className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white  shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <button
                key={language.name}
                onClick={() => handleLanguageSelect(language.name)}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
              >
                <img
                  src={language.icon}
                  alt={language.name}
                  className="mr-2 h-5 w-8"
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
interface GridContentProps {
  items: Item[];
  productsScrollRef: React.RefObject<HTMLDivElement>;
}
const images = [
  '/assets/images/Banner 1.jpg',
  '/assets/images/Banner 2.jpg',
  '/assets/images/Banner 3.jpg',
  '/assets/images/Banner 4.jpg',
  '/assets/images/Banner 5.jpg',
];
const Ecommerce = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [, setFilteredItems] = useState([]);
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const [groupedItems, setGroupedItems] = useState<Record<string, Item[]>>({});
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const [visible, setVisible] = useState(false);
  const [showCart, setShowCart] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedShowCart = localStorage.getItem('showCart');
      return savedShowCart ? JSON.parse(savedShowCart) : true;
    }
    return true;
  });

  useEffect(() => {
    if (shopV2Data?.items) {
      const grouped = _.groupBy(shopV2Data.items, (item: Item) => item.itemData.categories[0]);
      setGroupedItems(grouped);
    }
  }, [shopV2Data]);

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

  const GridContent = ({ items, productsScrollRef }: GridContentProps) => (
    <div className="w-full overflow-hidden bg-white dark:bg-slate-800">
      <div className="relative w-full px-2 pb-4">
        <Button
          onClick={() => scrollLeft(productsScrollRef)}
          className={`absolute left-0 top-1/2 z-10 ml-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md dark:bg-white ${
            items.length <= 5 ? 'hidden' : 'block'
          }`}
          style={{ transform: 'translateY(-50%)' }}
        >
          <svg
            className="size-4 text-black dark:text-black rtl:rotate-180"
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
          className="flex w-full flex-nowrap space-x-4 overflow-x-auto overflow-y-hidden px-4 py-2"
          style={{ scrollBehavior: 'smooth' }}
        >
          {items.map((item: Item) => (
            <a
              key={item._id}
              href={`/ProductPage/${item._id}`}
              className="w-[190px] flex-none rounded-lg no-underline hover:no-underline hover:border-transparent bg-white text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-slate-900 sm:w-[250px] cursor-pointer" 
            >
              <img
                alt={item?.itemData?.name || 'Product Image'}
                src={
                  item?.itemData?.imageUrl
                    ? `${imagePath}${item.itemData.imageUrl}`
                    : '/placeholder-image.jpg'
                }
                className="mx-auto mb-4 mt-1 h-[160px] w-[180px] rounded-md object-cover sm:h-[210px] sm:w-[240px] transition duration-300 ease-in-out hover:scale-105"
              />
              <div className="mx-2 mb-4">
                <h2 className="mb-2 text-start text-sm text-black dark:text-white">
                  {item?.itemData?.name || 'Unnamed Product'}
                </h2>
                <div className="flex items-center justify-between">
                  <h5 className="mt-2 text-lg font-bold text-violet-700 dark:text-white">
                    {formatCurrency(
                      item?.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || 0,
                      shopV2Data?.shop?.currency
                    )}
                  </h5>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="mt-2 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white"
                  >
                    <img
                      src="/assets/images/add-to-cart.png"
                      alt="Add to Cart Icon"
                      className="size-4"
                    />
                  </Button>
                </div>
              </div>
            </a>
          ))}
        </div>
        <Button
          onClick={() => scrollRight(productsScrollRef)}
          className={`absolute right-0 top-1/2 z-10 mr-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md dark:bg-white ${
            items.length <= 5 ? 'hidden' : 'block'
          }`}
          style={{ transform: 'translateY(-50%)' }}
        >
          <svg
            className="size-4 text-black dark:text-black rtl:rotate-180"
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
  );

  const ListContent = ({ items }: { items: Item[] }) => (
    <div className="w-full bg-white dark:bg-black">
      <List
        className="bg-white dark:bg-slate-800"
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={items}
        renderItem={(item: Item) => (
          <List.Item>
            <a
              href={`/ProductPage/${item._id}`}
              className="flex w-full justify-between no-underline rounded-md border shadow-sm dark:border-gray-700 dark:bg-slate-900 cursor-pointer hover:no-underline hover:border-transparent" 
            >
              <div className="flex w-full items-center sm:w-auto">
                <Avatar
                  src={
                    item?.itemData?.imageUrl
                      ? `${imagePath}${item.itemData.imageUrl}`
                      : '/placeholder-image.jpg'
                  }
                  className="m-2 size-20 rounded-md sm:size-28 transition duration-300 ease-in-out hover:scale-110"
                />
                <div>
                  <h3 className="mb-3 text-sm text-black dark:text-white">
                    {item?.itemData?.name || 'Unnamed Product'}
                  </h3>
                  <h5 className="!w-5 text-lg font-bold text-violet-700 dark:text-white sm:w-4">
                    {formatCurrency(
                      item?.itemData?.variations?.[0]?.itemVariationData?.priceMoney?.amount || 0,
                      shopV2Data?.shop?.currency
                    )}
                  </h5>
                </div>
              </div>
              <div className="mr-5 flex items-center gap-4">
                <div>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                    className="mt-10 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 text-base font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white"
                  >
                    <img
                      src="/assets/images/add-to-cart.png"
                      alt="Add to Cart Icon"
                      className="size-4"
                    />
                  </Button>
                </div>
              </div>
            </a>
          </List.Item>
        )}
      />
    </div>
  );

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
  const showDrawer = () => {
    setVisible(true);
  };

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
   
  return (
    <MultipleSkeletons loading={isFetching}>
      {shopV2Data?.subCategories?.length <= 0 ? (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600 dark:text-white">No subcategories found.</p>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="relative flex min-h-screen max-w-full flex-col bg-[#e8e4e4] dark:bg-black">
            {/* Sticky Header */}
            <header className="sticky left-0 top-0 z-50 h-32 w-full items-center justify-between bg-violet-500 shadow-lg shadow-indigo-500/50 sm:h-48">
              <div className="flex items-center justify-between">
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
                  <p className="my-3 ml-5 text-center text-xl text-white sm:ml-0 sm:text-2xl">
                    {shopV2Data?.shop?.name || 'Logo'}
                  </p>
                </div>
                <div className="absolute inset-x-0 top-0 mt-16 flex items-center justify-center px-4 sm:hidden">
                  <Search
                    placeholder="Type your keyword..."
                    allowClear
                    size="large"
                    onSearch={onSearch}
                    className="mr-6 w-[400px] sm:w-[300px]"
                  />
                </div>
                <div className="hidden items-center justify-center sm:flex">
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
                  <button
                    type="button"
                    className="relative mr-2 inline-flex items-center rounded-lg text-center text-sm font-medium text-white hover:border"
                  >
                    <svg
                      className="size-7"
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
                    <div className="absolute -end-2 -top-2 inline-flex size-6 items-center justify-center rounded-full border-2 border-white bg-red-500 text-xs font-bold text-white dark:border-white">
                      0
                    </div>
                  </button>
                  <div className="flex items-center justify-end pr-1">
                    <Button
                      type="text"
                      icon={<MenuOutlined style={{ fontSize: '22px' }} />}
                      onClick={showDrawer}
                      className="ml-2 text-white hover:!text-white sm:hidden"
                    />
                  </div>
                </div>
              </div>
              <nav className="hidden max-w-full flex-col gap-4 overflow-auto whitespace-nowrap px-4 sm:flex sm:flex-row sm:pl-5">
                <div className="flex w-full min-w-full max-w-full items-start justify-start gap-4 overflow-x-auto whitespace-nowrap sm:pl-5 sm:pr-8">
                  <ul className="relative flex flex-row items-center justify-center space-x-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    {shopV2Data?.subCategories?.map((subCategory: any) => (
                      <li key={subCategory._id} className="list-none">
                        <Button
                          size="large"
                          onClick={() => onClickCategory(subCategory)}
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
                {shopV2Data?.subCategories?.map((subCategory: any) => (
                  <Menu.Item
                    key={subCategory._id}
                    onClick={() => onClickCategory(subCategory)}
                  >
                    {subCategory.name}
                  </Menu.Item>
                ))}
              </Menu>
            </Drawer>

            {/* Banner Scroll Section */}
            <div
              id="default-carousel"
              className="relative w-full"
              data-carousel="slide"
            >
              <div className="relative h-44 overflow-hidden sm:h-96">
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

            {/* Main Content */}
            <main className="mb-4 flex-1 px-2 mt-4 sm:px-4">
              {Object.entries(groupedItems).map(([categoryId, items]) => (
                <div key={categoryId} className="bg-white dark:bg-slate-800 rounded-sm shadow-sm mb-4">
                  <div className="flex justify-between items-center p-4">
                    <h3 className="text-xl font-bold dark:text-white">
                      {shopV2Data?.subCategories?.find((cat: any) => cat._id === categoryId)?.name ||
                        'Uncategorized'}
                    </h3>
                    <button
                      className="group relative text-lg font-bold text-violet-600 dark:text-white"
                    >
                      See All
                      <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-violet-600 transition-all duration-300 group-hover:w-full dark:bg-white"></span>
                    </button>
                  </div>
                  <div className="p-4">
                    {showCart ? (
                      <GridContent items={items} productsScrollRef={productsScrollRef} />
                    ) : (
                      <ListContent items={items} />
                    )}
                  </div>
                </div>
              ))}
            </main>

            <footer className="mt-4">
            <div className="bg-gray-900">
              <div className="mx-auto max-w-2xl py-10 text-white">
                <div className="text-center">
                  <h3 className="mb-3 text-3xl">Download our fitness app</h3>
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
                  <button>
                    <p className="order-2 hover:text-white md:order-1 md:mt-0">
                      &copy; Point hub POS.
                    </p>
                  </button>
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