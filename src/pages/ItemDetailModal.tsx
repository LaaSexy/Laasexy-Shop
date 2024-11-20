import React, { useState } from "react";
import { List } from "antd";
import { Alert } from 'antd';
const ItemDetailModal: React.FC = () => {
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedAddIns, setSelectedAddIns] = useState<number[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const handleClick = () => {
    setQuantity(0);
    setSelectedAddIns([]);
    setSelections({
      size: "",
      sugarLevel: "",
      icedLevel: "",
    });
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
  };

  const [selections, setSelections] = useState<{
    size: string;
    sugarLevel: string;
    icedLevel: string;
  }>({
    size: "",
    sugarLevel: "",
    icedLevel: "",
  });

  const onClickItem = (type: keyof typeof selections, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleAddInClick = (cost: number) => {
    setSelectedAddIns((prev) => [...prev, cost]);
  };

  const getBorderClass = (type: keyof typeof selections, value: string) => {
    return selections[type] === value
      ? "border-purple-700 border-2 text-purple-700 font-semibold"
      : "border-gray-400 ";
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);

  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
    if (quantity < 0) setQuantity((prev) => prev - 1);
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleModal = () => setIsVisible((prev) => !prev);

  const basePrice = 3.5;
  const addInsTotal = selectedAddIns.reduce((acc, cost) => acc + cost, 0);
  const totalPrice = (quantity * basePrice + addInsTotal).toFixed(2);

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleModal}
        className="bg-violet-800 mt-5 ml-5 text-white py-2 px-4 rounded-md"
      >
        Open Modal
      </button>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-end transition-opacity duration-300 ${
          isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleModal} 
      >
        <div
          className={`bg-white rounded-t-3xl shadow-lg w-full max-w-md transition-transform duration-300 ${
            isVisible ? "translate-y-0" : "translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Content */}
          <div className="max-h-screen">
            {/* Header Section */}
            <div className="max-w-md relative mx-auto bg-stone-100 rounded-lg shadow-xl">
            <div className="flex items-center mb-4 bg-white py-4">
              {/* Image */}
              <img
                src="https://assets.codepen.io/13471/pikachu-gx.webp"
                alt="Hot latte"
                className="w-16 h-16 rounded-md mr-4 ml-4"
              />

              {/* Hot Latte Text */}
              <h2 className="text-lg font-bold flex-grow">Hot latte</h2>
              <div>
                <button
                  onClick={toggleModal}
                  className="text-black mr-5 mb-5 text-2xl text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

              {/* Options Section */}
              <div className="mb-4 bg-white py-4">
                <h3 className="text-lg mb-1 ml-4 font-semibold">Options</h3>
                <div className="flex gap-2 justify-center">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      onClick={() => onClickItem("size", size)}
                      className={`bg-white hover:text-violet-800 hover:border-violet-800 py-2 px-10 border ${getBorderClass(
                        "size",
                        size
                      )} rounded-md shadow`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugar and Iced Level Section */}
              <div className="mb-4 max-h-80 overflow-y-auto bg-white py-4">
                <h3 className="text-lg mb-1 ml-4 font-semibold">Sugar level</h3>
                <div className="overflow-x-auto whitespace-nowrap px-4 scrollbar-hide">
                  <List
                    itemLayout="vertical"
                    dataSource={["10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"]}
                    renderItem={(level) => (
                      <button
                        key={level}
                        onClick={() => onClickItem("sugarLevel", level)}
                        className={`flex-shrink-0 bg-white hover:border-violet-800 hover:text-violet-800 text-sm py-2 px-7 border ${getBorderClass(
                          "sugarLevel",
                          level
                        )} rounded-md shadow`}
                      >
                        {level}
                      </button>
                    )}
                  />
                </div>
                <hr className="bg-gray-400 my-4" />
                <h3 className="text-lg mb-1 ml-4 font-semibold">Iced level</h3>
                <div className="flex gap-2 ml-4">
                  {["Normal", "Less", "More"].map((level) => (
                    <button
                      key={level}
                      onClick={() => onClickItem("icedLevel", level)}
                      className={`bg-white hover:border-violet-800 hover:text-violet-800 py-2 px-10 border ${getBorderClass(
                        "icedLevel",
                        level
                      )} rounded-md shadow`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                
                <hr className="bg-gray-400 my-4" />
                <h3 className="text-lg mb-1 ml-4 font-semibold">Add-ins</h3>
                <div className="flex gap-2 ml-4">
                  {[
                    { label: "Extra($1.00)", cost: 1.0 },
                    { label: "2Extra($2.00)", cost: 2.0 },
                  ].map(({ label, cost }) => (
                    <button
                      key={label}
                      onClick={() => handleAddInClick(cost)}
                      className="bg-white hover:border-violet-800 hover:text-violet-800 text-gray-800 py-2 px-6 border border-gray-400 rounded-md shadow"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Add to Order */}
              <div className="items-center rounded-t-3xl shadow-md relative bottom-0 py-1 p-8 bg-white">
              <div className="flex items-center gap-6 justify-center">
                <button
                  onClick={decreaseQuantity}
                  className={`bg-white text-violet-800 py-1 px-8 border-2 font-black text-2xl border-violet-800 rounded-xl shadow ${
                    quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={quantity <= 0} 
                >
                  -
                </button>
                <span className="text-5xl font-bold mx-5">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="bg-white text-violet-800 py-1 px-8 border-2 font-black text-2xl border-violet-800 rounded-xl shadow"
                >
                  +
                </button>
              </div>
                <div className="flex justify-center align-center">
                {alertVisible && (
                  <Alert
                    message="Ordered Successfully"
                    type="success"
                    showIcon
                    closable
                    onClose={() => setAlertVisible(false)}
                    style={{ fontSize: '1rem', width: '80%',position: 'fixed', top: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}
                  />
                )}
                <button
                  onClick={handleClick}
                  className="bg-violet-800 w-96 text-white hover:bg-violet-700 text-xl mt-3 mb-4 py-4 border rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Add to order - ${totalPrice}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetailModal;