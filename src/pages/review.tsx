import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Alert, Avatar, Button, List } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useAuthications from '@/hooks/useAuth';
import { useV2Items } from '@/hooks/useItems';
import useOrder from '@/hooks/useOrder';
import useSession, { sessionAtom } from '@/hooks/useSession';
import { formatCurrency } from '@/utils/numeral';
import { cartAtom } from './components/ItemDetailModal';
import { IMAGE_PATH } from './components/left_menu_style/menu_list';
import MultipleSkeletons from './components/MultipleSkeletons';
import { generateInvoiceId } from '@/utils/generateInvoiceId';

const Review = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [orderId, setOrderId] = useState(generateInvoiceId());
  const [alertVisible, setAlertVisible] = useState(false);
  const [session] = useAtom(sessionAtom);
  const [, setQuantities] = useState<number[]>([]);
  const [, setPrices] = useState<number[]>([]);
  const { mutate: isSuccess } = useAuthications();
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const { mutate: createOrder } = useOrder();
  const { mutate: createSession } = useSession();

  useEffect(() => {
    if (!isSuccess) {
      createSession();
    }
  }, [isSuccess]);

  const increaseQuantity = (index: number) => {
    setCart((prevCart: any) => {
      const updatedCart = [...prevCart];
      const item: any = updatedCart[index];
      const modifierCost =
        item?.selectedAddIns
          ?.map((value: any) => value.price)
          .reduce((sum: any, price: any) => sum + (price || 0), 0) || 0;
      const basePrice = item.price + modifierCost;
      if (!item) return updatedCart;
      item.quantity = (item.quantity || 0) + 1;
      item.total = basePrice * item.quantity;
      return updatedCart;
    });
  };
  const decreaseQuantity = (index: number) => {
    setCart((prevCart: any) => {
      const updatedCart = [...prevCart];
      const item: any = updatedCart[index];
      const modifierCost =
        item?.selectedAddIns
          ?.map((value: any) => value.price)
          .reduce((sum: any, price: any) => sum + (price || 0), 0) || 0;
      const basePrice = item.price + modifierCost;
      if (item.quantity > 0) {
        item.quantity -= 1;
        item.total = basePrice * item.quantity;
      }
      return updatedCart;
    });
  };
  const calculateTotal = () => {
    return cart
      .filter((item) => item?.total > 0)
      .reduce((total, item) => total + (item?.total || 0), 0)
      .toFixed(0);
  };
  const total: any = calculateTotal();
  const currency = shopV2Data?.shop?.currency || 'USD';
  const handleOrder = () => {
    const orderItems = cart.map((item: any) => ({
      id: item.id,
      name: item?.itemData?.name,
      itemId: item?._id,
      imageUrl: item?.itemData?.imageUrl,
      variationId: item?.variation?._id,
      categoryId: item?.itemData?.categories?.[0],
      price: item?.price,
      quantity: item?.quantity,
      unit: item?.unit,
      createdAt: item?.createAt,
      modifiers: item?.modifiers,
    }));
    if (session?._id && orderItems.length > 0) {
      createOrder({
        orderId,
        sessionId: session?._id,
        items: orderItems,
      });
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
      setCart([]);
      setQuantities([]);
      setPrices([]);
      setOrderId(generateInvoiceId());
    }
  };
  const handleCheckOut = () => {
    if (query?.branch && query?.table) {
      router.push({
        pathname: '/checkout',
        query: {
          branch: query.branch,
          table: query.table,
        },
      });
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
            <Button className="float-left flex items-center justify-center border-none p-5 text-2xl shadow-none hover:text-black active:!border-none active:outline-none dark:bg-black dark:hover:!text-white sm:text-2xl">
              <LeftOutlined onClick={onClickToShowData} />
            </Button>
            <div className="mr-14 flex w-full items-center justify-center">
              <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
                Review Order
              </h2>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-2 pb-16 pt-4 sm:px-4">
            <div className="max-h-[calc(100vh-250px)] w-full overflow-y-auto sm:max-h-[calc(100vh-180px)]">
              <div className="flex items-center justify-center">
                <div className="flex w-11/12 items-center justify-between">
                  <h2 className="mb-3 w-full rounded-lg bg-violet-400 py-1 text-center text-xl font-medium text-white dark:bg-violet-500 dark:text-white sm:py-3 sm:text-xl">
                    Table #8
                  </h2>
                </div>
              </div>
             
                <List
                className="mr-2 rounded-md border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800"
                dataSource={cart}
                renderItem={(item: any, index: any) => (
                  <List.Item
                    key={item.id}
                    className="flex items-center justify-between rounded-lg p-2"
                  >
                    <div className="flex items-start">
                      <Avatar
                        src={
                          IMAGE_PATH + (item?.itemData?.imageUrl || 'default-image')
                        }
                        alt={item?.itemData?.name}
                        className="ml-3 mr-3 size-24 rounded-md sm:size-24 shadow-lg shadow-gray-500/30 dark:shadow-lg dark:shadow-gray-900/50"
                      />
                      <div className="w-48 text-gray-700 dark:text-white">
                        <p className="text-sm font-bold">
                          {item?.itemData?.name || 'Unknown'}
                        </p>
                        <p className="w-48 text-xs text-gray-600 dark:text-gray-300 sm:w-[700px]">
                          {item?.selectedAddIns?.map(({ name, type, price = 0 }: any, indexs: any) => {
                            if (name && type && price !== undefined) {
                              return (
                                <span key={indexs}>
                                  {`${type}: ${name}${
                                    price !== 0 ? ` + ${formatCurrency(price, currency)}` : ''
                                  }`}
                                  {indexs < item.selectedAddIns.length - 1 ? ', ' : ''}
                                </span>
                              );
                            }
                            return '';
                          })}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Button
                            onClick={() => decreaseQuantity(index)}
                            size="small"
                            className={`flex !h-7 w-16 items-center justify-center rounded-2xl border border-violet-800 bg-white px-7 py-0 !text-xl font-black text-violet-800 shadow sm:h-10 sm:w-14 sm:text-base ${
                              item?.quantity <= 0 ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                            disabled={item?.quantity <= 0}
                          >
                            -
                          </Button>
                          <span className="text-lg font-bold text-gray-700 dark:text-white sm:text-lg">
                            {item?.quantity || 0}
                          </span>
                          <Button
                            onClick={() => increaseQuantity(index)}
                            size="small"
                            className="flex !h-7 w-16 items-center justify-center rounded-2xl border border-violet-800 bg-white px-7 py-0 !text-xl font-black text-violet-800 shadow dark:bg-white sm:h-10 sm:w-14 sm:text-base"
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                    <span className="mb-5 mr-4 font-bold text-purple-700 text-sm dark:text-white sm:text-base">
                      {`${formatCurrency(item?.total, currency)}`}
                    </span>
                  </List.Item>
                )}
              />
              
            </div>
          </main>
          {alertVisible && (
            <Alert
              message="Ordered Successfully"
              type="success"
              showIcon
              closable
              onClose={() => setAlertVisible(false)}
              className="absolute left-1/2 top-6 z-50 -translate-x-1/2 text-sm sm:text-base"
            />
          )}

          {/* Fixed Footer */}
          <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-2xl bg-white py-4 shadow-[0px_-4px_6px_rgba(0,_0,_0,_0.1)] dark:shadow-[0_-4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-6">
            <button
              onClick={cart.length > 0 ? handleOrder : handleCheckOut}
              className="mx-4 w-11/12 rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-600 p-3 text-lg font-semibold text-white shadow-md hover:opacity-95 sm:w-3/5 sm:p-3"
            >
              {cart.length === 0 ? (
                <span className="flex items-center justify-center">
                  <ShoppingCartOutlined className="mr-2" /> Checkout Now
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <SendOutlined className="mr-2" /> Send Order{' - '}
                  {formatCurrency(total ?? 0, currency ?? 'USD')}
                </span>
              )}
            </button>
          </footer>
        </div>
      </div>
    </MultipleSkeletons>
  );
};
export default Review;
