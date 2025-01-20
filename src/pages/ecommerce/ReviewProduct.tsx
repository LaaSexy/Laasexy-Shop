import React, { useEffect, useState } from 'react';
import {
  LeftOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Avatar, Button, List, Alert } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import useAuthications from '@/hooks/useAuth';
import { useV2Items } from '@/hooks/useItems';
import useOrder, { orderIdAtom } from '@/hooks/useOrder';
import useSession, { sessionAtom } from '@/hooks/useSession';
import { formatCurrency } from '@/utils/numeral';
import { cartAtom } from '../components/ItemDetailModal';
import { IMAGE_PATH } from '../components/left_menu_style/menu_list';
import MultipleSkeletons from '../components/MultipleSkeletons';
import { generateInvoiceId } from '@/utils/generateInvoiceId';

const ReviewProduct = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [orderId, setOrderId] = useState(generateInvoiceId());
  const [session] = useAtom(sessionAtom);
  const [idOrder] = useAtom(orderIdAtom);
  const [, setQuantities] = useState<number[]>([]);
  const [, setPrices] = useState<number[]>([]);
  const { mutate: isSuccess } = useAuthications();
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const { mutate: createOrder } = useOrder();
  const { mutateSession: createSession } = useSession();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning', content: string } | null>(null);

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  useEffect(() => {
    if (!session?._id) {
      setAlertMessage({ type: 'warning', content: 'You can not create the session so you can not send order!!' });
    }
  }, [session?._id]);

  useEffect(() => {
    const storedOrderSuccess = localStorage.getItem('orderSuccess');
    if (storedOrderSuccess === 'true') {
      setOrderSuccess(true);
    }
  }, []);

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
      name: item?.name,
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

    createOrder({
      orderId,
      sessionId: session?._id,
      items: orderItems,
    });
    
    setOrderSuccess(true);
    localStorage.setItem('orderSuccess', 'true');
    setCart([]);
    setQuantities([]);
    setPrices([]);
    setOrderId(generateInvoiceId());
  };

  const handleAddMoreItems = () => {
    router.push({
      pathname: '/ecommerce',
      query: {
        branch: query.branch,
      },
    });
  };

  const handleCheckout = () => {
    router.push({
      pathname: '/ecommerce/checkout',
      query: {
        branch: query.branch,
      },
    });
  };

  const onClickToShowData = () => {
    if (query?.branch) {
      router.push({
        pathname: '/ecommerce',
        query: {
          branch: query.branch,
        },
      });
    }
  };

  const OrderSuccessPage = () => (
    <div className="bg-white dark:bg-black flex justify-center items-center min-h-svh">
      <div className="flex flex-col items-center rounded-xl bg-white dark:bg-black p-6 md:p-8 lg:p-10">
        <div className="bg-green shadow-lg text-white animate-pulse rounded-full mb-8">
          <svg
            className="ft-green-tick"
            xmlns="http://www.w3.org/2000/svg"
            height="100"
            width="100"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <circle className="circle" fill="#5bb543" cx="24" cy="24" r="22" />
            <path
              className="tick"
              fill="none"
              stroke="#FFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
              d="M14 27l5.917 4.917L34 17"
            />
          </svg>
        </div>
        <h1 className="text-xl md:text-2xl mb-4 font-bold text-gray-800 dark:text-white text-center">
          Order Sent Successfully!
        </h1>
        <div className="flex justify-between items-center">
          <p className="text-gray-900 font-semibold text-lg dark:text-white">Order number: </p>
          <p className="text-gray-900 font-semibold text-lg dark:text-white ml-4">{idOrder}</p>
        </div>
        <div className="w-full sm:w-[500px] mb-10">
          <p className="text-gray-600 text-center mt-3 dark:text-white">
            Congratulations! Your order has been successfully placed.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={handleAddMoreItems}
            className="w-full sm:w-auto mx-4 rounded-lg border-none flex justify-center items-center bg-gradient-to-r from-violet-500 to-indigo-600 p-2 !text-lg font-semibold text-white hover:!text-gray-400 shadow-md hover:opacity-95"
          >
            Add More Items
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            className="w-full sm:w-auto mx-4 rounded-lg border-none flex justify-center items-center bg-gradient-to-r from-violet-500 to-indigo-600 p-2 !text-lg font-semibold text-white hover:!text-gray-400 shadow-md hover:opacity-95"
          >
            <svg
              className="w-4 h-4 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 21"
            >
              <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
            </svg>
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );

  const removeItemFromCart = (index: number) => {
    setCart((prevCart: any) => {
      const updatedCart = [...prevCart];
      updatedCart.splice(index, 1);
      return updatedCart;
    });
  };

  return (
    <MultipleSkeletons loading={isFetching}>
      {orderSuccess && cart.length <= 0 ? (
        <OrderSuccessPage />
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="relative flex min-h-screen max-w-full flex-col bg-white dark:bg-black">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-2">
              <Button className="float-left flex items-center justify-center border-none !p-5 text-2xl shadow-none hover:text-black active:!border-none active:outline-none dark:bg-black dark:hover:!text-white sm:text-2xl">
                <LeftOutlined onClick={onClickToShowData} />
              </Button>
              <div className="mr-16 flex w-full items-center justify-center">
                <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
                  Review Order
                </h2>
              </div>
            </header>
            {/* Display Alert if there's a message */}
            {alertMessage && (
              <div className="flex justify-center items-center mt-4">
                <Alert
                  message={alertMessage.content}
                  type={alertMessage.type}
                  showIcon
                  closable
                  onClose={() => setAlertMessage(null)}
                  className="w-96 text-center text-sm sm:w-[700px]"
                />
              </div>
            )}
            {/* Main Content */}
            <main className="flex-1 overflow-y-auto mb-28 px-2 pt-4 sm:px-4">
              <div className="w-full">
                <List
                  className="rounded-md"
                  dataSource={cart}
                  itemLayout="horizontal"
                  renderItem={(item: any, index: any) => (
                    <List.Item>
                      <div className="flex items-center w-full justify-between rounded-lg border bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-slate-900">
                        <div className="flex items-start">
                          <Avatar
                            src={
                              IMAGE_PATH + (item?.itemData?.imageUrl || 'default-image')
                            }
                            alt={item?.itemData?.name}
                            className="ml-1 mr-2 mt-1 mb-1 size-20 rounded-md sm:size-24"
                          />
                          <div className="w-48 text-gray-700 mt-1 dark:text-white sm:mt-3">
                            <p className="truncate text-sm font-bold text-gray-700 dark:text-white">
                              {item?.name || 'Unknown'}
                            </p>
                            <p className="truncate sm:w-[500px] text-xs text-gray-600 dark:text-gray-300">
                              {item?.selectedAddIns?.map(({ name, type, price = 0 }: any, ind: any) => {
                                if (name && type && price !== undefined) {
                                  return (
                                    <span key={ind}>
                                      {`${type}: ${name}${
                                        price !== 0 ? ` + ${formatCurrency(price, currency)}` : ''
                                      }`}
                                      {ind < item.selectedAddIns.length - 1 ? ', ' : ''}
                                    </span>
                                  );
                                }
                                return '';
                              })}
                            </p>
                            
                            <div className="mt-2 flex items-center">
                              <Button
                                onClick={() => decreaseQuantity(index)}
                                shape="circle"
                                className={`flex items-center text-base sm:text-xl border-violet-500 text-violet-500 font-semibold justify-center w-7 h-7 sm:w-8 sm:h-8 dark:border-slate-600 dark:text-slate-300 ${
                                  item?.quantity <= 0 ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                                disabled={item?.quantity <= 0}
                              >
                                -
                              </Button>
                              <h1 className="px-4 sm:px-4 text-base sm:text-xl font-semibold text-gray-900 dark:text-slate-100 min-w-[24px] text-center">
                                {item?.quantity || 0}
                              </h1>
                              <Button
                                onClick={() => increaseQuantity(index)}
                                shape="circle"
                                className="flex items-center text-base sm:text-xl border-violet-500 bg-violet-500 text-white hover:!text-white font-semibold justify-center w-7 h-7 sm:w-8 sm:h-8 dark:border-slate-600 dark:text-slate-300"
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        </div>
                          <div className="flex flex-col items-end justify-center">
                            <span className="mb-5 mr-3 font-bold text-purple-700 text-sm dark:text-white sm:text-base">
                                  {`${formatCurrency(item?.total, currency)}`}
                            </span>
                            <Button
                                type="text"
                                danger
                                onClick={() => removeItemFromCart(index)}
                                className="mt-2 flex font-medium text-sm sm:text-base items-center justify-center text-red-500 hover:text-red-700"
                              >
                                <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                                </svg>
                                Remove
                              </Button>
                          </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </main>
            {/* Fixed Footer */}
            <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-2xl bg-white py-4 shadow-[0px_-4px_6px_rgba(0,_0,_0,_0.1)] dark:shadow-[0_-4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-6">
              <button
                onClick={handleOrder}
                className={`mx-4 w-11/12 rounded-3xl bg-gradient-to-r from-violet-500 to-indigo-600 p-3 text-lg font-semibold text-white shadow-md sm:w-3/5 sm:p-3 ${
                  cart.length <= 0 || !session?._id ? 'opacity-50 hover:opacity-none cursor-not-allowed' : ''
                }`}
                disabled={cart.length <= 0 || !session?._id}
              >
                <span className="flex items-center justify-center">
                  <SendOutlined className="mr-2" /> Send Order{' - '}
                  {formatCurrency(total ?? 0, currency ?? 'USD')}
                </span>
              </button>
            </footer>
          </div>
        </div>
      )}
    </MultipleSkeletons>
  );
};
export default ReviewProduct;