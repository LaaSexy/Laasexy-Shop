import { Button } from "antd";
import { useRouter } from "next/router";

const Payment = () => {
  const router = useRouter();
  const { game, price, userId, serverId } = router.query;

  const handleBack = () => {
    router.push({
      pathname: "/Index",
    });
  };

  return (
    <div className="min-h-screen bg-[url('/assets/images/Background1.jpg')] bg-cover flex flex-col dark:bg-black">
      <header className="">
        <Button
          size="large"
          onClick={handleBack}
          className="bg-blue-500 hover:!bg-blue-400 !text-white hover:!text-white flex justify-center items-center ml-4 mt-5"
        >
          <img
            src="/assets/images/Back Arrow.png"
            alt=""
            className="size-5 mr-1"
          />
          Back
        </Button>
      </header>
      <div className="container mx-auto flex-1">
        <div className="flex flex-col lg:flex-row justify-between items-center min-h-[calc(100vh-80px)]">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 mb-8 mt-10 sm:mt-0 lg:mb-0 sm:pb-20 sm:pl-32">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 max-w-md mx-auto w-full">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                Payment Details
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Game:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {game || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    Price:
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {price ? `${price} USD` : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">
                    User ID:
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {userId || "N/A"}
                  </span>
                </div>
                {serverId && serverId.length > 1 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">
                      Server ID:
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {serverId || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Unchanged */}
          <div className="flex flex-col lg:flex-row justify-end items-center flex-1">
            <div className="relative flex flex-1 w-full justify-center items-center h-full ">
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
    </div>
  );
};

export default Payment;
