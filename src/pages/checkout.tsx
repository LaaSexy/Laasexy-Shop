import React, { useEffect, useState } from 'react';
import { LeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, List } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useAuthications from '@/hooks/useAuth';
import useOrderSessionId from '@/hooks/useCheckOut';
import { useV2Items } from '@/hooks/useItems';
import { sessionAtom } from '@/hooks/useSession';
import { formatCurrency } from '@/utils/numeral';
import { IMAGE_PATH } from './components/left_menu_style/menu_list';
import MultipleSkeletons from './components/MultipleSkeletons';
import { deviceIdAtom, initializeDeviceUuidAtom } from './newPage';
import useSocket from '@/hooks/useSocket';

const checkout = () => {
  const [deviceId] = useAtom(deviceIdAtom);
  const [alertVisible, setAlertVisible] = useState(false);
  const [items, setItems] = useState([]);
  const [session] = useAtom(sessionAtom);
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const { mutate: loginDevice, isSuccess } = useAuthications();
  const [, initializeDeviceUuid] = useAtom(initializeDeviceUuidAtom);
  const { mutate, data,  } = useOrderSessionId();

  useEffect(() => {
    const item =
      data
        ?.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        ?.flatMap((value: any) => value.items) || [];
    setItems(item);
  }, [data]);

  const handleOrderUpdate = ( ) => {
    mutate({ sessionId: session?._id || '' })
  };

  const { isConnected } = useSocket({
    onReceivedOrder: handleOrderUpdate,
  });

  useEffect(() => {
    if (isConnected) {
      console.log(`Socket connected: ${isConnected}`);
    }
  }, [isConnected]);

  useEffect(() => {
    if (deviceId === null) {
      initializeDeviceUuid();
    }
  }, [deviceId]);

  useEffect(() => {
    if (isSuccess) {
      mutate({ sessionId: session?._id || '' });
    }
  }, [isSuccess]);

  useEffect(() => {
    if (query?.branch) {
      loginDevice({
        deviceUuid: deviceId,
        branchId: query.branch,
        tableNumber: query.table,
      });
    }
  }, [query, deviceId]);

  const calculateTotal = () => {
    return items
      .filter((item: any) => item?.total > 0)
      .reduce((total: any, item: any) => total + (item?.total || 0), 0)
      .toFixed(0);
  };
  const total = calculateTotal();
  const currency = shopV2Data?.shop?.currency || 'USD';
  const handleCheckOut = () => {
    if (items.length > 0) {
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      setItems([]);
    }
  };
  const onClickToShowData = () => {
    if (query?.branch && query?.table) {
      router.push({
        pathname: '/newPage',
        query: {
          branch: query.branch,
          table: query.table,
        },
      });
    }
  };

  return (
    <MultipleSkeletons loading={isFetching}>
      <div className="flex min-h-screen flex-col">
        <div className="relative flex min-h-screen max-w-full flex-col bg-white dark:bg-black">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-2">
            <Button className="float-left flex items-center justify-center border-none p-5 text-2xl shadow-none hover:text-black  dark:bg-black dark:hover:!text-white sm:text-2xl">
              <LeftOutlined onClick={onClickToShowData} />
            </Button>
            <div className="mr-16 flex w-full items-center justify-center">
              <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
                Checkout Page
              </h2>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-2 pb-16 pt-4 sm:px-4">
            <div className="max-h-[calc(100vh-390px)] w-full overflow-y-auto sm:max-h-[calc(100vh-350px)]">
              <div className="flex items-center justify-center">
                <div className="flex w-11/12 items-center justify-between">
                  <h2 className="mb-3 w-full rounded-lg bg-violet-400 py-1 text-center text-xl font-medium text-white dark:bg-violet-500 dark:text-white sm:py-3 sm:text-xl">
                    Table to Checkout
                  </h2>
                </div>
              </div>
                <List
                className="mr-2 rounded-md border bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:mr-3"
                dataSource={items}
                renderItem={(item: any) => (
                  <List.Item
                    key={item.id}
                    className="flex items-center justify-between rounded-lg"
                  >
                    <div className="flex items-start">
                      <Avatar
                        src={IMAGE_PATH + (item?.imageUrl || 'default-image')}
                        alt={item?.name || 'Avatar'}
                        className="ml-3 mr-3 size-24 rounded-md sm:size-24 shadow-lg shadow-gray-500/30 dark:shadow-lg dark:shadow-gray-900/50"
                      />
                      <div className="w-48 text-gray-700 dark:text-white">
                        <p className="text-sm font-bold">
                          {item?.name || 'Unknown'}
                        </p>
                        <p className="w-48 text-xs text-gray-600 dark:text-gray-300 sm:w-[700px]">
                          {item?.modifiers?.map(
                            ({ name, type, price = 0 }: any, index: any) => {
                              if (name && type && price !== undefined) {
                                return (
                                  <span key={index}>
                                    {`${type}: ${name}${
                                      price !== 0 ? ` + ${formatCurrency(price, currency)}` : ''
                                    }`}
                                    {index < item.modifiers.length - 1 ? ', ' : ''}
                                  </span>
                                );
                              }
                              return '';
                            }
                          )}
                        </p>
                        <p className="w-48 text-xs text-gray-600 dark:text-gray-300 sm:w-96">
                          Status: {item?.status}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Button
                            size="small"
                            className="flex !h-7 w-16 items-center justify-center rounded-2xl bg-white px-7 py-0 !text-2xl font-black sm:h-10 sm:w-14 sm:text-base"
                            disabled
                          >
                            -
                          </Button>
                          <span className="text-xl font-bold text-gray-700 dark:text-white sm:text-lg">
                            {item?.quantity}
                          </span>
                          <Button
                            size="small"
                            disabled
                            className="flex !h-7 w-16 items-center justify-center rounded-2xl bg-white px-7 py-0 !text-2xl font-black sm:h-10 sm:w-14 sm:text-base"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <span className="mb-5 mr-4 font-bold text-purple-700 text-sm dark:text-white sm:text-base">
                      {formatCurrency(item?.total, currency)}
                    </span>
                  </List.Item>
                )}
              />
            </div>
          </main>
          {alertVisible && (
            <Alert
              message="Checkout Successfully"
              type="success"
              showIcon
              closable
              onClose={() => setAlertVisible(false)}
              className="absolute left-1/2 top-6 z-50 -translate-x-1/2 text-sm sm:text-base"
            />
          )}
          {/* Fixed Footer */}
          <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-2xl bg-white py-4 shadow-[0px_-4px_6px_rgba(0,_0,_0,_0.1)] dark:shadow-[0_-4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-6">
            <div className="flex flex-col space-y-2  dark:bg-black">
              <div className="mx-2 flex items-center justify-between">
                <h2 className="text-sm font-medium sm:text-lg">Quantity:</h2>
                <span className="ml-48 text-sm font-medium sm:ml-80 sm:text-lg">
                  {items.reduce(
                    (totals: any, item: any) => totals + (item?.quantity ?? 0),
                    0
                  )}
                </span>
              </div>
              <div className="mx-2 flex items-center justify-between">
                <h2 className="text-sm font-medium sm:text-lg">Sub Total:</h2>
                <span className="ml-48 text-sm font-medium sm:ml-80 sm:text-lg">
                  {formatCurrency(total ?? 0, currency ?? 'USD')}
                </span>
              </div>
              <div className="mx-2 flex items-center justify-between">
                <h2 className="text-sm font-medium sm:text-lg">
                  Discount:{' '}
                  {items.reduce(
                    (totals: any, item: any) =>
                      totals + (item?.itemData?.discount ?? 0),
                    0
                  )}
                  %
                </h2>
                <span className="ml-48 text-sm font-medium sm:ml-80 sm:text-lg">
                  {formatCurrency(
                    items.reduce(
                      (totals: any, item: any) =>
                        totals + (item?.itemData?.price ?? 0),
                      0
                    ) *
                      (1 -
                        items.reduce(
                          (totalDiscount, item: any) =>
                            totalDiscount + (item?.itemData?.discount ?? 0),
                          0
                        ) /
                          100),
                    currency ?? 'USD'
                  )}
                </span>
              </div>
              <hr className="border-t border-black dark:border-gray-700" />
              <div className="mx-2 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Total</h2>
                <span className="ml-48 text-lg font-semibold sm:ml-80">
                  {formatCurrency(total ?? 0, currency ?? 'USD')}
                </span>
              </div>
              <div className="flex w-full items-center justify-center bg-white dark:bg-black">
                <button
                  onClick={handleCheckOut}
                  className={`my-2 flex w-11/12 items-center justify-center rounded-3xl border border-white bg-gradient-to-r from-violet-500 to-indigo-600 p-2 text-center text-white hover:opacity-95 sm:mx-24`}
                >
                  <h2 className="text-xl">
                    <ShoppingCartOutlined /> Checkout {' - '}{' '}
                    {`(${items.length} ${
                      items.length === 1 ? 'item' : 'items'
                    })`}
                  </h2>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </MultipleSkeletons>
  );
};
export default checkout;
