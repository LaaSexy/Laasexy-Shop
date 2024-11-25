import React, { useEffect, useState } from "react";

import { Button } from "antd";

import { formatCurrency } from "@/utils/numeral";

import { IMAGE_PATH } from "./left_menu_style/menu_list";

import Modifiers from "./modifier";

const ItemDetailModal: React.FC = (props: any) => {
  const { isVisible, onClose, item, currency } = props;
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedAddIns, setSelectedAddIns] = useState<number[]>([]);
  const [selectedOption, setSelectionOption] = useState({ _id: null });
  const modifiers = item?.modifiers || [];
  const [total, setTotal] = useState(0);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedAddIns, selectedOption, quantity]);

  useEffect(() => {
    if (item?.itemData?.variations) {
      setSelectionOption(item.itemData.variations[0]);
    }
  }, [item]);

  const handleClick = () => {
    setQuantity(0);
    setSelectedAddIns([]);
  };

  const handleAddInClick = (cost: number) => {
    setSelectedAddIns((prev) => [...prev, cost]);
  };

  const onClickItem = (option) => {
    setSelectionOption(option);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  //TOTAL VALUE IN BUTTON TO CLICK
  const calculateTotalPrice = () => {
    const basePrice =
      selectedOption?.itemVariationData?.priceMoney?.amount || 0;
    const modifierCost =
      selectedAddIns
        ?.map(({ price }) => price)
        .reduce((sum, price) => sum + (price || 0), 0) || 0;
    const myTotal = (basePrice + modifierCost) * quantity;
    console.log(myTotal);
    setTotal(myTotal);
  };

  // SHOW OPTIONS ON THE TOP MODAL
  const optionRender = (variations: any) => {
    if (variations?.length < 2) {
      return null;
    }
    return (
      <div className="max-h-80 overflow-y-auto md:max-h-96">
        <div className="mb-4 bg-white py-2">
          <h3 className="ml-4 text-lg font-semibold">Options</h3>
          <div className="ml-5  flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap">
            {variations?.map((value: any) => (
              <Button
                key={value._id}
                onClick={() => onClickItem(value)}
                size="large"
                className={`${
                  selectedOption?._id === value?._id
                    ? "border-violet-800 text-violet-800 border-2 !font-semibold"
                    : "border-gray-400 text-gray-800"
                } bg-white hover:border-violet-800 hover:text-violet-800 sm:px-6 border !rounded-md`}
              >
                {`${value?.itemVariationData?.name} - ${formatCurrency(
                  value?.itemVariationData?.priceMoney?.amount,
                  currency
                )}`}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  //SHOW FULL PAGE ITEM DETAIL
  return (
    <div
      className={`fixed inset-0 bg-black z-0 bg-opacity-70 flex justify-center items-end transition-opacity duration-300 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={() => {
        setQuantity(0);
        onClose();
        handleAddInClick(0);
      }}
    >
      <div
        className={`bg-white !rounded-t-3xl shadow-lg w-full sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "translate-y-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-screen rounded-t-xl">
          <div className="relative bg-stone-100 shadow-xl">
            <div className="mb-4 flex items-center bg-white py-4">
              <img
                src={IMAGE_PATH + item?.itemData?.imageUrl || "default-image"}
                alt={item?.itemData?.name || "Item"}
                className="mx-4 h-12 w-12 rounded-md sm:h-16 sm:w-16"
              />
              <h2 className="grow text-base font-bold sm:text-lg">
                {item?.itemData?.name || "Unknown Name"}
              </h2>
              <button
                onClick={() => {
                  setQuantity(0);
                  onClose();
                  handleAddInClick(0);
                }}
                className="mr-5 mb-2 text-lg font-bold text-black sm:mr-7 sm:mb-5 sm:text-2xl"
              >
                ✕
              </button>
            </div>
            {optionRender(item?.itemData?.variations)}
            <Modifiers
              onChanged={setSelectedAddIns}
              selectedVariation={selectedOption}
              data={modifiers}
            />
            <div className="relative bottom-0 mt-10 items-center rounded-t-3xl bg-white p-4 py-5 shadow-md">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="large"
                  onClick={decreaseQuantity}
                  className={`bg-white text-violet-800 !mr-4 !w-[60px] sm:px-6 border-2 font-black !text-3xl border-violet-800 flex items-center justify-center ${
                    quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={quantity <= 0}
                >
                  -
                </Button>
                <span className="mx-3 text-2xl font-bold sm:mx-5 sm:text-5xl">
                  {quantity}
                </span>
                <Button
                  size="large"
                  onClick={increaseQuantity}
                  className="!ml-4 flex !w-[60px] items-center justify-center border-2 border-violet-800 bg-white !text-3xl font-black text-violet-800 sm:px-6"
                >
                  +
                </Button>
              </div>
              <div className="align-center flex justify-center">
                <Button
                  size="large"
                  onClick={() => {
                    handleClick();
                    onClose();
                  }}
                  className="sm:w-98 mt-5 mb-4 !h-[60px] w-full bg-violet-800 !text-xl text-white hover:bg-violet-700 hover:!text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-xl"
                >
                  Add to order - {`${formatCurrency(total, currency)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ItemDetailModal;
