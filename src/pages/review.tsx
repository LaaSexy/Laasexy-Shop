import React, { useState } from "react";
import { Alert } from "antd";
import { LeftOutlined } from '@ant-design/icons';
const Review = () => {
  const [quantities, setQuantities] = useState([0, 0, 0, 0]); 
  const prices = [6.5, 6.5, 4.0, 7.0];
  const [alertVisible, setAlertVisible] = useState(false);

  const items = [
    { name: "Hot Latte", imageUrl: "https://assets.codepen.io/13471/pikachu-gx.webp" },
    { name: "Cold Latte", imageUrl: "https://assets.codepen.io/13471/pikachu-gx.webp" },
    { name: "Espresso", imageUrl: "https://assets.codepen.io/13471/pikachu-gx.webp" },
    { name: "Iced Coffee", imageUrl: "https://assets.codepen.io/13471/pikachu-gx.webp" },
  ];

  const increaseQuantity = (index) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((qty, i) => (i === index ? qty + 1 : qty))
    );
  };

  const decreaseQuantity = (index) => {
    setQuantities((prevQuantities) =>
      prevQuantities.map((qty, i) => (i === index && qty > 0 ? qty - 1 : qty))
    );
  };

  const calculateTotal = () => {
    return quantities.reduce(
      (total, qty, index) => total + qty * prices[index],
      0
    ).toFixed(2);
  };

  const handleOrder = () => {
    setQuantities([0, 0, 0, 0]);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-max relative">
      <div className="bg-white rounded-lg shadow-lg p-3 w-full max-w-md flex flex-col justify-between">
        <div className="flex items-center justify-between shadow-lg mb-3 rounded-xl">
          <button className="float-left mr-2 text-3xl ml-3">
            <LeftOutlined />
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center mt-5 mr-32">Review order</h2>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="w-full text-center text-3xl font-medium rounded-lg bg-purple-200 py-3">
            Table #8
          </h2>
        </div>
        {items.map((item, index) => (
          <div key={index} className="mt-4 flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 rounded-md mr-4 ml-4"
              />
              <span className="text-gray-700 font-bold">
                {item.name}
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => decreaseQuantity(index)}
                    className={`bg-white text-purple-500 py-0 px-7 border-2 font-black text-xl border-purple-500 rounded-2xl shadow ${
                      quantities[index] <= 0 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={quantities[index] <= 0}
                  >
                    -
                  </button>
                  <span className="text-gray-700 font-bold text-xl">
                    {quantities[index]}
                  </span>
                  <button
                    onClick={() => increaseQuantity(index)}
                    className="bg-white text-purple-500 py-0 px-7 border-2 font-black text-xl border-purple-500 rounded-2xl shadow"
                  >
                    +
                  </button>
                </div>
              </span>
            </div>
            <span className="text-purple-700 font-3xl">${prices[index].toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-40 pt-6 flex justify-center">
          {alertVisible && (
            <Alert
              message="Ordered Successfully"
              type="success"
              showIcon
              closable
              onClose={() => setAlertVisible(false)}
              style={{
                fontSize: "1rem",
                position: "fixed",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
            />
          )}
          <button
            onClick={handleOrder}
            className="bg-violet-800 text-white w-96 py-3 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Send Orders - ${calculateTotal()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Review;
