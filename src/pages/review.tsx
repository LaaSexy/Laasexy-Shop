import React, { useEffect, useState } from 'react';

import {
  LeftOutlined,
  SendOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { v4 as uuidv4 } from 'uuid';

import useAuthications from '@/hooks/useAuth';
import { useV2Items } from '@/hooks/useItems';
import useOrder from '@/hooks/useOrder';
import useSession, { sessionAtom } from '@/hooks/useSession';
import { formatCurrency } from '@/utils/numeral';

import { cartAtom } from './components/ItemDetailModal';
import { IMAGE_PATH } from './components/left_menu_style/menu_list';
import MultipleSkeletons from './components/MultipleSkeletons';

interface AddIn {
  name: string;
  type: string;
  price?: number;
}
interface CartItem {
  id: string;
  itemData: {
    name: string;
    imageUrl: string;
    categories?: string[];
  };
  _id: string;
  variation?: { _id: string };
  modifiers?: any;
  price: number;
  quantity: number;
  total: number;
  selectedAddIns?: AddIn[];
}

const Review = () => {
  const [cart, setCart] = useAtom<CartItem[]>(cartAtom);
  const [orderId, setOrderId] = useState(uuidv4());
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
      const updatedCart: CartItem[] = [...prevCart];
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
      const updatedCart: CartItem[] = [...prevCart];
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
      setOrderId(uuidv4());
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
          <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-t-lg bg-white py-2 shadow-md dark:bg-black sm:py-2">
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
              {cart.length > 0 ? (
                cart.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="mb-3 flex items-center justify-between rounded-lg border bg-white p-2 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                  >
                    <div className="flex">
                      <img
                        src={
                          item?.itemData?.imageUrl
                            ? IMAGE_PATH + item.itemData.imageUrl
                            : 'default-image'
                        }
                        alt={item?.itemData?.name}
                        className="mr-3 size-20 rounded-md sm:size-20"
                      />
                      <span className="w-48 text-gray-700 dark:text-white">
                        <p className="text-sm font-bold">
                          {item?.itemData?.name || 'Unknown'}
                        </p>
                        <p className="w-48 text-xs text-gray-600 dark:text-gray-300 sm:w-96">
                          {item?.selectedAddIns?.map(
                            (
                              {
                                name,
                                type,
                                price = 0,
                              }: { name: any; type: any; price?: number },
                              index: number
                            ) => {
                              if (name && type && price !== undefined) {
                                return (
                                  <span key={index}>
                                    {`${type}: ${name}${
                                      price !== 0
                                        ? ` + ${formatCurrency(
                                            price,
                                            currency
                                          )}`
                                        : ''
                                    }`}
                                    {index < item.selectedAddIns.length - 1
                                      ? ', '
                                      : ''}
                                  </span>
                                );
                              }
                              return null;
                            }
                          )}
                        </p>
                        <div className="mt-2 flex items-center space-x-4">
                          <Button
                            onClick={() => decreaseQuantity(index)}
                            size="large"
                            className={`flex !h-7 w-16 items-center justify-center rounded-2xl border border-violet-800 bg-white px-7 py-0 !text-2xl font-black text-violet-800 shadow sm:h-10 sm:w-14 sm:text-base ${
                              item?.quantity <= 0
                                ? 'cursor-not-allowed opacity-50'
                                : ''
                            }`}
                            disabled={item?.quantity <= 0}
                          >
                            -
                          </Button>
                          <span className="text-xl font-bold text-gray-700 dark:text-white sm:text-lg">
                            {item?.quantity || 0}
                          </span>
                          <Button
                            size="large"
                            onClick={() => increaseQuantity(index)}
                            className="flex !h-7 w-16 items-center justify-center rounded-2xl border border-violet-800 bg-white px-7 py-0 !text-2xl font-black text-violet-800 shadow dark:bg-white sm:h-10 sm:w-14 sm:text-base"
                          >
                            +
                          </Button>
                        </div>
                      </span>
                    </div>
                    <span className="mb-5 font-bold text-purple-700 dark:text-white">
                      {`${formatCurrency(item?.total, currency)}`}
                    </span>
                  </div>
                ))
              ) : (
                <h2 className="mt-5 text-center text-2xl font-bold text-gray-500">
                  No items in the cart.
                </h2>
              )}
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
          <footer
            className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-2xl bg-white py-4 shadow-[0px_-4px_6px_rgba(0,_0,_0,_0.1)] dark:bg-black sm:py-6"
          >
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
