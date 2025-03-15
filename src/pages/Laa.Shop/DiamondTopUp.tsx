import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Button } from "antd";

interface Service {
  title: string;
  image: string;
}

interface Game {
  name: string;
  image: string;
  services: Service[];
}

const games: Game[] = [
  {
    name: "Mobile Legends",
    image: "/assets/images/Mobile.png",
    services: [
      { title: "5 ✥ 0.11$", image: "/assets/images/Diamond.webp" },
      { title: "86 ✥ 1.27$", image: "/assets/images/Diamond.webp" },
      { title: "172 ✥ 2.39$", image: "/assets/images/Diamond.webp" },
      { title: "257 ✥ 3.47$", image: "/assets/images/Diamond.webp" },
      { title: "343 ✥ 4.58$", image: "/assets/images/Diamond.webp" },
      { title: "706 ✥ 8.82$", image: "/assets/images/Diamond.webp" },
      { title: "2195 ✥ 26.44$", image: "/assets/images/Diamond.webp" },
      { title: "3688 ✥ 44.77$", image: "/assets/images/Diamond.webp" },
      { title: "5532 ✥ 68.02$", image: "/assets/images/Diamond.webp" },
      { title: "9288 ✥ 112.88$", image: "/assets/images/Diamond.webp" },
      { title: "Weekly 1.34$", image: "/assets/images/Weeklyss.png" },
    ],
  },
  {
    name: "Free Fire",
    image: "/assets/images/freeFire.png",
    services: [
      { title: "25 ✥ 0.25$", image: "/assets/images/Diamond.webp" },
      { title: "100 ✥ 0.85$", image: "/assets/images/Diamond.webp" },
      { title: "310 ✥ 2.61$", image: "/assets/images/Diamond.webp" },
      { title: "1060 ✥ 8.59$", image: "/assets/images/Diamond.webp" },
      { title: "2180 ✥ 17.34$", image: "/assets/images/Diamond.webp" },
      { title: "5600 ✥ 42.68$", image: "/assets/images/Diamond.webp" },
      { title: "Weekly 1.47$", image: "/assets/images/Weeklys.png" },
      { title: "Monthly 6.99$", image: "/assets/images/Monthly.png" },
      {
        title: "Weekly Lite 0.34$",
        image: "/assets/images/WeeklyLite.png",
      },
      { title: "Evo7Day 0.89$", image: "/assets/images/Evo7day.png" },
      { title: "Evo30Day 2.59$", image: "/assets/images/Evo30day.png" },
      { title: "11500 ✥ 88.48$", image: "/assets/images/Diamond.webp" },
      { title: "Evo3Day 0.58$", image: "/assets/images/Evo30day.png" },
    ],
  },
  {
    name: "PUBG Mobile",
    image: "/assets/images/pubg.png",
    services: [
      { title: "60 UC 0.92$", image: "/assets/images/UC.png" },
      { title: "325 UC 4.57$", image: "/assets/images/UC.png" },
      { title: "660 UC 9.05$", image: "/assets/images/UC.png" },
      { title: "1800 UC 22.62$", image: "/assets/images/UC.png" },
      { title: "3850 UC 45.23$", image: "/assets/images/UC.png" },
      { title: "8100 UC 89.24$", image: "/assets/images/UC.png" },
    ],
  },
  {
    name: "Honor of Kings",
    image: "/assets/images/hornorOfKing.png",
    services: [
      { title: "17 ✥ 0.18$", image: "/assets/images/image.png" },
      { title: "88 ✥ 0.89$", image: "/assets/images/image.png" },
      { title: "432 ✥ 4.53$", image: "/assets/images/image.png" },
      { title: "605 ✥ 6.22$", image: "/assets/images/image.png" },
      { title: "2724 ✥ 25.99$", image: "/assets/images/image.png" },
      { title: "9160 ✥ 82.56$", image: "/assets/images/image.png" },
      { title: "Weekly 0.79$", image: "/assets/images/Weekly.png" },
      {
        title: "Weekly Plus 82.56$",
        image: "/assets/images/WeeklyPlus.png",
      },
    ],
  },
];

const DiamondTopUpApp = () => {
  const router = useRouter();
  const { game } = router.query;
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [serverId, setServerId] = useState<string>("");
  const [paymentAttempted, setPaymentAttempted] = useState<boolean>(false);

  useEffect(() => {
    const gameName = typeof game === "string" ? game : undefined;
    const gameData: any = games.find((g) => g.name === gameName) || games[0];
    setSelectedGame(gameData);
  }, [game]);

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Loading...</h1>
      </div>
    );
  }

  const handleBack = () => {
    router.push({
      pathname: "/Index",
    });
  };

  const isFormValid = () => {
    if (selectedGame.name === "Mobile Legends") {
      return userId.trim() !== "" && serverId.trim() !== "";
    }
    return userId.trim() !== "";
  };

  const handlePayment = (service: Service) => {
    const priceMatch = service.title.match(/(\d+\.?\d*)\$$/);
    const price = priceMatch ? priceMatch[1] : "0";
    if (!isFormValid()) {
      setPaymentAttempted(true);
      return;
    }
    setPaymentAttempted(false);
    router.push({
      pathname: "/Laa.Shop/payment",
      query: {
        game: selectedGame.name,
        price,
        userId,
        serverId: selectedGame.name === "Mobile Legends" ? serverId : undefined,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[url('/assets/images/Background1.jpg')] bg-cover bg-gray-900 text-white p-6">
      <div className="flex justify-start items-center ">
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
      </div>
      <div className="max-w-3xl mx-auto p-6 rounded-2xl shadow-lg">
        <div
          className={`grid gap-4 mb-4 ${
            selectedGame.name === "Mobile Legends"
              ? "grid-cols-2"
              : "grid-cols-1"
          }`}
        >
          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Enter ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full p-2 bg-gray-700 text-white rounded-md"
              required
            />
            {paymentAttempted && userId.trim() === "" && (
              <p className="text-red-500 text-sm mt-1 ">User ID is required</p>
            )}
          </div>
          <div className="flex flex-col">
          {selectedGame.name === "Mobile Legends" && (
            <div>
              <input
                type="number"
                placeholder="Enter Server ID"
                value={serverId}
                onChange={(e) => setServerId(e.target.value)}
                className="w-full p-2 bg-gray-700 rounded-md text-white"
                required
              />
              {paymentAttempted && serverId.trim() === "" && (
                <p className="text-red-500 text-sm mt-1">
                  Server ID is required
                </p>
              )}
            </div>
          )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 p-4 justify-center rounded-2xl">
            <img
              src="/assets/images/Thunder.webp"
              alt="Thunder"
              className="w-10 h-10"
            />
            <span className="text-xl font-semibold">{selectedGame.name}</span>
            <img
              src={selectedGame.image}
              alt={selectedGame.name}
              className="w-10 h-10 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {selectedGame.services.map((service, index) => (
            <div
              key={index}
              onClick={() => handlePayment(service)}
              className="flex flex-col items-center p-4 bg-gray-700 rounded-lg hover:bg-[#403c3c] transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(255,_255,_255,_0.7)]
              cursor-pointer"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-16 h-16 mb-2 rounded"
              />
              <p className="text-sm font-semibold">{service.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiamondTopUpApp;
