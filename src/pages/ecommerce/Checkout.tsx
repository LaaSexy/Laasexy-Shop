import React, { useEffect, useState } from 'react';
import { DeleteOutlined, HomeOutlined, InfoCircleOutlined, LeftOutlined, PhoneOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Input, List, Radio, Tooltip, message } from 'antd';
import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';
import { formatCurrency } from '@/utils/numeral';
import MultipleSkeletons from '../components/MultipleSkeletons';
import { deviceIdAtom, initializeDeviceUuidAtom } from './index';
import { IMAGE_PATH } from '../components/menu_list';
import { cartAtom } from './ProductDetail';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { AsYouType } from 'libphonenumber-js';
interface PaymentOptionProps {
  src?: string;
  title?: string;
  description?: string;
  value: string;
}

const playFailSound = () => {
  const audio = new Audio('/assets/audio/error.mp3');
  audio.play().catch((error) => {
    console.error('Failed to play sound:', error);
  });
};

const Checkout = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [deviceId] = useAtom(deviceIdAtom);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [addressError, setAddressError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);
  const [, initializeDeviceUuid] = useAtom(initializeDeviceUuidAtom);

  useEffect(() => {
    if (deviceId === null) {
      initializeDeviceUuid();
    }
  }, [deviceId]);

  const calculateTotal = () => {
    return cart
      .filter((item: any) => item?.total > 0 && item?.status !== "cancel")
      .reduce((total: any, item: any) => total + (item?.total || 0), 0)
      .toFixed(0);
  };

  const total = calculateTotal();
  const currency = shopV2Data?.shop?.currency || 'USD';

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = new AsYouType('KH').input(value);
    setPhone(formattedValue);
    if (formattedValue.startsWith('0') && isValidPhoneNumber(formattedValue, 'KH')) {
      setPhoneError('');
    } else {
      setPhoneError('Invalid Cambodian phone number. It must start with 0 and be valid for Cambodia.');
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!address.trim()) {
      setAddressError('Address is required');
      isValid = false;
    } else {
      setAddressError('');
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!phone.startsWith('0') || !isValidPhoneNumber(phone, 'KH')) {
      setPhoneError('Invalid phone number. It must start with 0 and be valid for Cambodia.');
      isValid = false;
    } else {
      setPhoneError('');
    }
    return isValid;
  };

  useEffect(() => {
    setIsValid(validateInputs());
  }, [address, phone]);

  const handleCheckOut = () => {
    if (cart.length === 0) {
      message.error('Your cart is empty');
      playFailSound();
      return;
    }
    if (!validateInputs()) {
      return;
    }
    if (!paymentMethod) {
      message.error('Please select a payment method');
      playFailSound();
      return;
    }
    setIsCheckoutSuccess(true);
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

  const PaymentOption: React.FC<PaymentOptionProps> = ({ src, title, description, value }) => {
    return (
      <div className="w-full sm:flex-1 bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] py-4 px-4 rounded-lg mb-3 sm:mb-0 cursor-pointer hover:shadow-lg transition-shadow duration-300 dark:bg-slate-800">
        <label htmlFor={`radio-${value}`} className="flex justify-between items-center w-full h-full">
          <img src={src} alt={title} className="w-12 h-12 object-cover rounded-lg" />
          <div className="flex-1 mx-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
          </div>
          <Radio id={`radio-${value}`} value={value} className="custom-radio" />
        </label>
      </div>
    );
  };

  const handleAddMoreItems = () => {
    if (query?.branch) {
      router.push({
        pathname: '/ecommerce',
        query: {
          branch: query.branch,
        },
      });
    }
  };

  const CheckoutSuccessPage = () => (
    <div className="bg-white dark:bg-black flex justify-center items-center min-h-svh">
      <div className="flex flex-col items-center rounded-xl bg-white dark:border-gray-800 dark:border dark:bg-black p-6 md:p-8 lg:p-10 shadow-lg">
        <div className="text-black animate-pulse mb-8">
          <img src="/assets/images/checkout.png" alt="Checkout Successfully" className="size-96 transform transition-transform duration-500 hover:scale-105" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white text-center">
          Your order is made! 🎉
        </h1>
        <div className="w-full sm:w-[500px] mb-5">
          <p className="text-gray-600 text-center mt-3 dark:text-white">
            Congratulation! Your order has been successfully proceed, we will pick up your order soon as possible!
          </p>
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-white">
                <span className="font-semibold">Order ID:</span> <strong>54222</strong>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-white">
                <span className="font-semibold">Address:</span> <strong>{address}</strong>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-white">
                <span className="font-semibold">Phone number:</span> <strong>{phone}</strong>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-gray-600 dark:text-white">
                <span className="font-semibold">Amount Total:</span> <strong>
                  {formatCurrency(total ?? 0, currency ?? 'USD')}
                </strong>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            type="button"
            onClick={handleAddMoreItems}
            className="w-full sm:w-auto mx-4 px-20 rounded-lg border-none flex justify-center items-center bg-violet-500 p-2 !text-lg font-semibold text-white hover:bg-violet-600 transition-colors duration-300 shadow-md"
          >
            <img src="/assets/images/Back Arrow.png" alt="" className="size-8 mr-1" />
            Explore More
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
    message.error('You has been deleted 1 items!');
    playFailSound();
  };
  
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
      if (item.quantity > 1) {
        item.quantity -= 1;
        item.total = basePrice * item.quantity;
      }
      return updatedCart;
    });
  };

  if (isCheckoutSuccess) {
    return <CheckoutSuccessPage />;
  }

  return (
    <MultipleSkeletons loading={isFetching}>
      <div className="flex min-h-screen flex-col">
        <div className="relative flex min-h-screen max-w-full flex-col bg-white dark:bg-black">
          {/* Sticky Header */}
          <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] dark:bg-black sm:py-2">
            <Button
              className="float-left flex items-center justify-center border-none p-5 dark:bg-black text-2xl shadow-none hover:text-black dark:hover:text-white"
              onClick={onClickToShowData}
            >
              <LeftOutlined />
            </Button>
            <div className="mr-16 flex w-full items-center justify-center">
              <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
                Checkout
              </h2>
            </div>
          </header>
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto px-2 pt-6 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-36">
              {/* Left Column: Contact and Payment Method */}
              <div className="space-y-6 borer bg-white sm:px-4 sm:py-4 px-1 py-1 rounded-md dark:bg-black dark:border-gray-800 dark:border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <h3 className="text-xl font-bold dark:text-white">Contact</h3>
                <div className="flex flex-col gap-4">
                  {/* Phone Input */}
                  <div className="w-full">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter your Phone number<span className="text-red-500 font-bold ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="phone"
                        placeholder="Enter your Phone number"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-base dark:bg-slate-700 dark:text-white"
                        prefix={<PhoneOutlined className="text-gray-500 dark:text-gray-400 mr-3" />}
                        suffix={
                          <Tooltip title="Extra information">
                            <InfoCircleOutlined className="text-gray-500 dark:text-gray-400" />
                          </Tooltip>
                        }
                        value={phone}
                        onChange={handlePhoneNumberChange}
                      />
                    </div>
                    {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
                  </div>
                  {/* Address Input */}
                  <div className="w-full">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter your Address<span className="text-red-500 font-bold ml-1">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="address"
                        placeholder="Enter your Address"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-base dark:bg-slate-700 dark:text-white"
                        prefix={<HomeOutlined className="text-gray-500 dark:text-gray-400 mr-3" />}
                        suffix={
                          <Tooltip title="Extra information">
                            <InfoCircleOutlined className="text-gray-500 dark:text-gray-400" />
                          </Tooltip>
                        }
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
                  </div>
                  {/* Name Input */}
                  <div className="w-full">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Enter your Name
                    </label>
                    <div className="flex items-center gap-3">
                      <Input
                        id="address"
                        placeholder="Enter your Name"
                        className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-base dark:bg-slate-700 dark:text-white"
                        prefix={<UserOutlined className="text-gray-500 dark:text-gray-400 mr-3" />}
                        suffix={
                          <Tooltip title="Extra information">
                            <InfoCircleOutlined className="text-gray-500 dark:text-gray-400" />
                          </Tooltip>
                        }
                      />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold dark:text-white mt-6">Payment Method</h3>
                <Radio.Group name="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} defaultValue="cash" className="w-full">
                  <div className="flex flex-col gap-4">
                    <PaymentOption
                      src="/assets/images/cash on delivery.png"
                      title="Cash On Delivery"
                      description="Checked Automatically"
                      value="cash"
                    />
                    <PaymentOption
                      src="/assets/images/ABA.png"
                      title="ABA Bank"
                      description="Checked Automatically"
                      value="aba"
                    />
                  </div>
                </Radio.Group>
              </div>
              {/* Right Column: Your Order */}
              <div className="borer bg-white rounded-md dark:bg-black sm:px-4 sm:py-4 px-1 py-1 dark:border-gray-800 dark:border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
                <h3 className="text-xl font-bold dark:text-white mb-2">Order</h3>
                <List
                  className="rounded-md"
                  dataSource={cart}
                  itemLayout="horizontal"
                  renderItem={(item: any, index: any) => (
                    <List.Item>
                      <div className="flex items-center w-full justify-between rounded-lg border bg-white p-1 shadow-sm dark:border-gray-700  hover:shadow-[0_3px_10px_rgb(0,0,0,0.2)] transition-shadow duration-300 dark:bg-slate-900">
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
                                className={`flex items-center text-base sm:text-xl border-violet-500 text-violet-500 font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300 ${
                                  item?.quantity <= 1 ? 'cursor-not-allowed opacity-50' : ''
                                }`}
                                disabled={item?.quantity <= 1}
                              >
                                -
                              </Button>
                              <h1 className="px-4 sm:px-4 text-base sm:text-xl font-semibold text-gray-900 dark:text-slate-100 min-w-[24px] text-center">
                                {item?.quantity || 0}
                              </h1>
                              <Button
                                onClick={() => increaseQuantity(index)}
                                shape="circle"
                                className="flex items-center text-base sm:text-xl border-violet-500 bg-violet-500 text-white hover:!text-white font-semibold justify-center w-8 h-8 sm:w-10 sm:h-10 dark:border-slate-600 dark:text-slate-300"
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
                            <DeleteOutlined className="text-xl"/>
                          </Button>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </main>
          <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center rounded-t-2xl bg-white py-4 shadow-[0px_-4px_6px_rgba(0,_0,_0,_0.1)] dark:shadow-[0_-4px_6px_rgba(255,255,255,0.1)] dark:bg-slate-800 sm:py-6">
            <button
              onClick={handleCheckOut}
              className={`mb-2 flex w-11/12 items-center justify-center rounded-3xl border-none bg-gradient-to-r from-violet-500 to-indigo-600 p-3 text-center text-white transition-colors duration-300 shadow-lg sm:mx-24 ${
              cart.length <= 0 || !address || !isValid || !paymentMethod ? 'opacity-50 hover:opacity-none cursor-not-allowed' : ''
              }`}
              disabled={cart.length <= 0 || !address || !isValid || !paymentMethod}
            >
              <h2 className="text-xl">
                <ShoppingCartOutlined /> Checkout {' - '}{' '}
                {formatCurrency(total ?? 0, currency ?? 'USD')}
              </h2>
            </button>
          </footer>
        </div>
      </div>
    </MultipleSkeletons>
  );
};

export default Checkout;