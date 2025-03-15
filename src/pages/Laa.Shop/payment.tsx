import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";

const Payment = () => {
  const router = useRouter();
  const { game, price, userId, serverId } = router.query;

  console.log(game, userId, serverId)

  const handleBack = () => {  
    router.push({
      pathname: '/Index',
    });
  };

  return (
    <div className="h-screen bg-[url('/assets/images/Background1.jpg')] bg-cover bg-center min-h-screen flex flex-col bg-blue-100 dark:bg-black">
      <header className=" bg-blue-100 dark:bg-black">
        <Button
          size="large"
          onClick={handleBack}
          className="bg-violet-500 hover:!bg-violet-500 !text-white hover:!text-white flex justify-center items-center ml-5 mt-5"
        >
          <img
            src="/assets/images/Back Arrow.png"
            alt=""
            className="size-5 mr-1"
          />
          Back
        </Button>
      </header>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center bg-white">

        </div>
        <div className="flex flex-col lg:flex-row justify-end items-center flex-1">
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
                  {price + " USD"}
                </span>
              </p>
            </div>
            {/* QR Code Image */}
            <img
              src="/assets/images/QR Code.png"
              alt=""
              className="absolute mt-72"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
