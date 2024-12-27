import { Modal, Button } from 'antd';
import { DoubleLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';

const OrderSuccess = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);

  useEffect(() => {
    console.log(shopV2Data);
    console.log(isFetching);
  }, [shopV2Data, isFetching]);

  useEffect(() => {
    setIsClient(true); 
    setIsModalVisible(true);
  }, []);

  const handleAddMoreItems = () => {
    setIsModalVisible(false);
    router.push({
      pathname: '/newPage',
      query: {
        branch: query.branch,
        table: query.table,
      },
    });
  };

  const handleCheckout = () => {
    setIsModalVisible(false);
    router.push({
      pathname: '/checkout',
      query: {
        branch: query.branch,
        table: query.table,
      },
    });
  };

  if (!isClient) return null; 

  return (
    <div className="bg-white dark:bg-black flex justify-center items-center min-h-screen">
      {/* Modal */}
      <Modal
        visible={isModalVisible}
        footer={null}
        centered
        maskClosable={false}
        closable={false}
        width={600}
        onCancel={() => setIsModalVisible(false)}
      >
        <div className="flex flex-col items-center bg-white dark:bg-black">
          <div className="bg-green text-white animate-pulse rounded-full p-8 mb-6">
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

          {/* Message */}
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Order Sent Successfully!
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            Your order has been sent. You can add more items or proceed to checkout.
          </p>

          {/* Buttons */}
          <div className="flex justify-center items-center space-x-4">
            <Button
              size="large"
              className="mx-4 rounded-3xl flex border-none justify-center items-center bg-gradient-to-r !p-6 from-violet-500 to-indigo-600 text-white !text-xl hover:!text-white shadow hover:bg-gray-400"
              onClick={handleAddMoreItems}
            >
              <DoubleLeftOutlined /> Back to Add More Items
            </Button>
            <Button
              size="large"
              className="mx-4 rounded-3xl border-none flex justify-center items-center bg-gradient-to-r from-violet-500 to-indigo-600 !p-6 !text-xl font-semibold text-white hover:!text-gray-400 shadow-md hover:opacity-95"
              onClick={handleCheckout}
            >
              <ShoppingCartOutlined /> Checkout Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderSuccess;
