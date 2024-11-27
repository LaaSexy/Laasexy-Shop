import React, { useEffect, useState } from 'react';

import { LeftOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { useAtom } from 'jotai';

import { cartAtom } from './components/ItemDetailModal';
import { IMAGE_PATH } from './components/left_menu_style/menu_list';

const Review = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [alertVisible, setAlertVisible] = useState(false);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [prices, setPrices] = useState<number[]>([]);
  useEffect(() => {
    console.log({ cart });
  }, [cart]);
  const increaseQuantity = (index) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const item = updatedCart[index];
      const modifierCost =
        item?.selectedAddIns
          ?.map(({ price }) => price)
          .reduce((sum, price) => sum + (price || 0), 0) || 0;
      const basePrice = item.price + modifierCost;
      if (!item) return updatedCart;
      item.quantity = (item.quantity || 0) + 1;
      item.total = basePrice * item.quantity;
      return updatedCart;
    });
  };
  const decreaseQuantity = (index) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      const item = updatedCart[index];
      const modifierCost =
        item?.selectedAddIns
          ?.map(({ price }) => price)
          .reduce((sum, price) => sum + (price || 0), 0) || 0;
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
  const handleOrder = () => {
    setCart([]);
    setQuantities([]);
    setPrices([]);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };
  return (
    <div className="relative flex flex-col items-center justify-between">
      <div className="relative flex h-screen w-full max-w-screen-sm flex-col justify-between rounded-lg bg-white shadow-2xl sm:max-w-md">
        <div className="my-4 flex items-center rounded-xl">
          <Button className="float-left flex items-center justify-center border-none px-5 py-4 text-3xl shadow-none hover:!text-black active:!border-none active:outline-none sm:text-2xl">
            <LeftOutlined />
          </Button>
          <div className="flex w-full items-center justify-center">
            <h2 className="mb-4 mr-7 mt-5 text-center text-2xl font-bold sm:text-xl md:text-2xl">
              Review order
            </h2>
          </div>
        </div>
        <div className="w-full grow overflow-y-auto pb-16">
          <div className="size-full !w-full max-w-full">
            <div className="flex items-center justify-center">
              <div className="flex w-11/12 items-center justify-between">
                <h2 className="w-full rounded-lg bg-purple-200 py-3 text-center text-3xl font-medium sm:text-xl">
                  Table #8
                </h2>
              </div>
            </div>
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div
                  key={index}
                  className="mr-5 mt-4 flex w-full items-center justify-between  py-3 shadow-sm"
                >
                  <div className="flex">
                    <img
                      src={
                        IMAGE_PATH + item?.itemData?.imageUrl || 'default-image'
                      }
                      alt={item?.itemData?.name}
                      className="mx-4 size-16 rounded-md"
                    />
                    <span className="font-bold text-gray-700">
                      {item?.itemData?.name || 'Unknown'}
                      <p className="w-56 text-xs text-gray-600">
                        {item?.selectedAddIns?.map(
                          ({ name, type, price = 0 }, index) => (
                            <span key={index}>
                              {`${type}: ${name}${
                                price !== 0
                                  ? ` + ${new Intl.NumberFormat().format(
                                      price
                                    )}៛`
                                  : ''
                              }`}
                              {index < item.selectedAddIns.length - 1
                                ? ', '
                                : ''}
                            </span>
                          )
                        )}
                      </p>
                      <div className="mt-2 flex items-center space-x-4">
                        <Button
                          onClick={() => decreaseQuantity(index)}
                          size="large"
                          className={`flex !h-8 w-16 items-center justify-center rounded-2xl border-2 border-purple-500 bg-white px-7 py-0 !text-2xl font-black text-purple-500 shadow sm:h-10 sm:w-14 sm:text-base ${
                            item?.quantity <= 0
                              ? 'cursor-not-allowed opacity-50'
                              : ''
                          }`}
                          disabled={item?.quantity <= 0}
                        >
                          -
                        </Button>
                        <span className="text-2xl font-bold text-gray-700 sm:text-lg">
                          {item?.quantity || 0}
                        </span>
                        <Button
                          size="large"
                          onClick={() => increaseQuantity(index)}
                          className="flex !h-8 w-16 items-center justify-center rounded-2xl border-2 border-purple-500 bg-white px-7 py-0 !text-2xl font-black text-purple-500 shadow sm:h-10 sm:w-14 sm:text-base"
                        >
                          +
                        </Button>
                      </div>
                    </span>
                  </div>
                  <span className="mb-8 mr-3 font-bold text-purple-700">
                    {new Intl.NumberFormat().format(item?.total || 0)}៛
                  </span>
                </div>
              ))
            ) : (
              <h2 className="mt-5 text-center text-2xl font-bold text-gray-500">
                No items in the cart.
              </h2>
            )}
          </div>
        </div>
        <div className="flex justify-center bg-white py-11">
          {alertVisible && (
            <Alert
              message="Send Order Successfully"
              type="success"
              showIcon
              closable
              onClose={() => setAlertVisible(false)}
              style={{
                fontSize: '1rem',
                position: 'fixed',
                top: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
              }}
            />
          )}
          <Button
            size="large"
            onClick={handleOrder}
            className="absolute bottom-0 mb-8 flex !h-12 w-96 items-center justify-center rounded-lg bg-violet-800 !text-2xl text-white hover:bg-violet-700 hover:!text-white sm:w-96 sm:text-lg"
          >
            Send Orders - {new Intl.NumberFormat().format(calculateTotal())}៛
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Review;
