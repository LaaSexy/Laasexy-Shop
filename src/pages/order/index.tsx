import React, { useEffect, useState } from 'react';
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List } from 'antd';
import { atom, useAtom } from 'jotai';
import _ from 'lodash';
import { useRouter } from 'next/router';
import useAuthications from '@/hooks/useAuth';
import useOrderSessionId from '@/hooks/useCheckOut';
import { useV2Items } from '@/hooks/useItems';
import useSession, { sessionAtom } from '@/hooks/useSession';
import { Item } from '@/types/Item';
import { formatCurrency } from '@/utils/numeral';
import ItemDetailModal, { cartAtom } from '../components/ItemDetailModal';
import MultipleSkeletons from '../components/MultipleSkeletons';
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

const newPage = () => {
  const [cart] = useAtom(cartAtom);
  const [deviceId] = useAtom(deviceIdAtom);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] = useState([]);
  const [session] = useAtom(sessionAtom);
  const [items, setItems] = useState([]);
  const [seletedItem, setSelectedItem] = useState(null);
  const [showCart, setShowCart] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const savedShowCart = localStorage.getItem("showCart");
      return savedShowCart ? JSON.parse(savedShowCart) : true; 
    }
    return true;
  });
  const { mutate, data } = useOrderSessionId();
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const { mutate: loginDevice, isSuccess } = useAuthications();
  const { mutateSession: createSession } = useSession();
  const [, initializeDeviceUuid] = useAtom(initializeDeviceUuidAtom);
 
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("showCart", JSON.stringify(showCart));
    }
  }, [showCart]);

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

  const onClickItem = (item: any) => {
    setSelectedItem(item);
  };

  const reviewOrder = () => {
    if (query?.branch && query?.table) {
      router.push({
        pathname: 'order/review',
        query: {
          branch: query.branch,
          table: query.table,
          name: query.name,
        },
      });
    }
  };

  const ProceedPayment = () => {
    if (query?.branch && query?.table) {
      router.push({
        pathname: 'order/checkout',
        query: {
          branch: query.branch,
          table: query.table,
          name: query.name,
        },
      });
    }
  };

  const onCancel = () => {
    setSelectedItem(null);
  };

  const GridContent = () => (
    <div className="mb-24 w-full overflow-hidden bg-white dark:bg-black">
      <List
        className="w-full bg-white py-1 dark:bg-black"
        style={{ scrollBehavior: 'smooth' }}
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={filteredItems}
        grid={{ xs: 2, sm: 2, lg: 4, xl: 4, xxl: 4, gutter: 10 }}
        renderItem={(item: any) => (
          <List.Item>
            <div
              onClick={() => onClickItem(item)}
              className="mx-auto mb-3 w-48 rounded-lg border bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-slate-900 sm:w-72"
            >
              <img
                alt={item?.itemData?.name || 'Product Image'}
                src={
                  item?.itemData?.imageUrl
                    ? `${imagePath}${item.itemData.imageUrl}`
                    : '/placeholder-image.jpg'
                }
                className="mx-auto mb-4 h-[160px] w-[280px] rounded-md object-cover sm:h-[210px] sm:w-[280px]"
              />
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
          </List.Item>
        )}
      />
    </div>
  );
  
  const ListContent = () => (
    <div className="mb-24 w-full bg-white dark:bg-black">
      <List
        className=" bg-white px-4 dark:bg-black sm:px-14"
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={filteredItems}
        renderItem={(item: any) => (
          <List.Item>
            <div
              onClick={() => onClickItem(item)}
              className="flex w-full justify-between rounded-md border shadow-sm  dark:border-gray-700 dark:bg-slate-900"
            >
              <div className="flex w-full items-center sm:w-auto">
                <Avatar
                  src={
                    item?.itemData?.imageUrl
                      ? `${imagePath}${item.itemData.imageUrl}`
                      : '/placeholder-image.jpg'
                  }
                  className="m-2 size-20 rounded-md sm:size-28"
                />
                <div>
                  <h3 className="mb-3 text-sm text-black dark:text-white">
                    {item?.itemData?.name || 'Unnamed Product'}
                  </h3>
                  <p className="!w-5 text-lg font-bold text-violet-700 dark:text-white sm:w-4">
                    {formatCurrency(
                      item.itemData.variations[0]?.itemVariationData.priceMoney
                        .amount,
                      shopV2Data?.shop?.currency
                    )}
                  </p>
                </div>
              </div>
              <div className="mr-5 flex items-center gap-4">
                <div>
                  <Button className="mt-10 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500  text-base font-bold text-violet-700 dark:border-none  dark:bg-violet-500 dark:text-white dark:hover:!text-white">
                    <img
                      src="/assets/images/add-to-cart.png"
                      alt="Add to Cart Icon"
                      className="size-4"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <MultipleSkeletons loading={isFetching}>
      <div className="container mx-auto flex min-h-screen max-w-full flex-col">
        <div className="flex min-h-screen flex-col bg-white dark:bg-black">
          {/* Sticky Header */}
          <header className="fixed top-0 left-0 h-44 w-full items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg shadow-indigo-500/50 sm:h-44">
            <div className="flex items-center justify-center">
              {shopV2Data?.shop?.logoUrl && (
                <img
                  src={
                    `https://api.pointhub.io${shopV2Data?.shop?.logoUrl}` ||
                    'Default'
                  }
                  alt="Logo"
                  className="mx-4 mt-7 size-24 rounded-md sm:mt-4 sm:size-28"
                />
              )}
            </div>
            <p className="my-3 text-center text-2xl text-white sm:my-2">
              {shopV2Data?.shop?.name || 'Logo'}
            </p>
          </header>
          {/* Main Content */}
          {/* <main className="flex flex-col md:flex-row mb-6 pt-20 mt-20">
            <section className="flex-1 p-4 pb-0">
              <div className="mt-5 rounded-lg border border-white bg-gradient-to-r from-violet-500 to-fuchsia-500 p-4 text-center text-white shadow-indigo-500/50 ">
                <h2 className="text-lg font-semibold">
               Hello the world
                </h2>
              </div>
            </section>
          </main> */}
          {/* nav content */}
          <nav className="sticky top-0 mt-44 z-10 flex max-w-full flex-col gap-4 overflow-auto whitespace-nowrap bg-white pl-6 pr-14 dark:bg-black sm:flex-row sm:pl-5 sm:pr-14">
            <div className="flex w-full min-w-full max-w-full items-start justify-start gap-4 overflow-x-auto whitespace-nowrap bg-white dark:bg-black  sm:pl-5 sm:pr-14">
              <ul className="relative flex flex-row items-center justify-center space-x-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                {shopV2Data?.subCategories?.map((subCategory: any) => (
                  <li key={subCategory._id} className="list-none">
                    <Button
                      size='large'
                      onClick={() => onClickCategory(subCategory)}
                      className={`my-3 rounded-md border flex justify-center items-center !p-5 border-[#DBD5D5] dark:hover:!border-violet-500 px-4 py-4 text-base dark:border-gray-700 sm:my-4 ${
                        selectedCategory === subCategory._id
                          ? ' bg-violet-500 text-white hover:!text-white dark:border-violet-500'
                          : 'bg-transparent'
                      }`}
                      aria-pressed={selectedCategory === subCategory._id}
                    >
                      {subCategory.name}
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="absolute right-0 mt-3 sm:mt-4 flex h-[40px] w-[50px] items-center justify-center rounded-md bg-white dark:bg-black">
                <Button
                  size="large"
                  onClick={() => setShowCart(!showCart)}
                  className="flex items-center justify-center bg-violet-500 text-xl text-white hover:!text-white dark:border-none"
                  aria-label="Open Options"
                >
                  {showCart ? <UnorderedListOutlined /> : <AppstoreOutlined />}
                </Button>
              </div>
            </div>
          </nav>
          {showCart ? <GridContent /> : <ListContent />}
          
          {(cart.length > 0 || items.length > 0) && (
            <footer className="fixed bottom-0 flex w-full shrink-0 items-center justify-center bg-white dark:bg-black">
              <button
                onClick={cart.length > 0 ? reviewOrder : ProceedPayment}
                className="mx-6 my-4 w-full rounded-3xl border border-white bg-gradient-to-r from-violet-500 to-indigo-600 p-2 text-center text-white hover:opacity-95 sm:mx-24"
              >
                <h2 className="text-lg font-semibold">
                  <ShoppingCartOutlined />
                  {cart.length > 0
                    ? ` Review Order - (${cart.length} ${
                        cart.length === 1 ? 'item' : 'items'
                      })`
                    : ` Proceed to checkout - (${items.length} ${
                        items.length === 1 ? 'item' : 'items'
                      })`}
                </h2>
              </button>
            </footer>
          )}
        </div>
        <ItemDetailModal
          currency={shopV2Data?.shop?.currency}
          isVisible={!!seletedItem}
          onClose={onCancel}
          item={seletedItem}
        />
      </div>
    </MultipleSkeletons>
  );
};
export default newPage;
