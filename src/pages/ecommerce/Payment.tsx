import React from 'react';
import { cartAtom } from './ProductDetail';
import { useAtom } from 'jotai';
import { formatCurrency } from '@/utils/numeral';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';
import { Button } from 'antd';
const Payment = () => {
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data} = useV2Items(query?.branch);
  const [cart] = useAtom(cartAtom);
  const calculateTotal = () => {
    return cart
      .filter((item: any) => item?.total > 0)
      .reduce((total: any, item: any) => total + (item?.total || 0), 0)
      .toFixed(2);
  };
  const currency = shopV2Data?.shop?.currency || 'USD';
  const total = calculateTotal();
  const handleBack = () => {
    if (query?.branch) {
      router.push({
        pathname: '/ecommerce',
        query: {
          branch: query.branch,
        },
      });
    }
  };
  return (
    <div className='h-screen flex flex-col bg-blue-100 dark:bg-black'>
      <header className=" bg-blue-100 dark:bg-black">
        <Button onClick={handleBack} size="large" className="bg-violet-500 !text-white hover:!text-white flex justify-center items-center ml-5 mt-5">
          <img src="/assets/images/Back Arrow.png" alt="" className="size-5 mr-1" />
          Back
        </Button>
      </header>
      <div className="flex flex-col lg:flex-row justify-between items-center flex-1">
        <div className="relative flex flex-1 w-full justify-center items-center bg-blue-100 p-5 h-full dark:bg-black">
          <img
            src="/assets/images/KHQR-Display-Aba.png"
            alt="KHQR Display"
            className="max-w-full h-auto"
          />
          <div className="absolute mb-36 mr-40">
            <p className="text-black text-lg">Teng Chantola</p>
            <p className="text-black text-lg">
              <span className="font-semibold mr-2 text-xl">
                {formatCurrency(total ?? 0, currency ?? "USD")}
              </span>
            </p>
          </div>
          {/* QR Code Image */}
          <img src="/assets/images/QR Code.png" alt="" className="absolute mt-72" />
        </div>
      </div>
    </div>
  );
};

export default Payment;