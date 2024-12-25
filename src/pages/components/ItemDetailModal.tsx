import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '@/utils/numeral';
import { IMAGE_PATH } from './left_menu_style/menu_list';
import Modifiers from './modifier';
interface SelectedOption {
  _id: string | null;
  itemVariationData?: {
    priceMoney?: {
      amount: number;
    };
  };
}
interface Modifier {
  price: number;
}
interface CartItem {
  id: string;
  modifiers: number[];
  total: number;
  quantity: number;
  price?: number;
  variation: SelectedOption;
}
interface ItemDetailModalProps {
  currency: string;
  isVisible: boolean;
  onClose: () => void;
  item: any;
}
export const cartAtom = atomWithStorage<CartItem[]>('cart', []);

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  currency,
  isVisible,
  onClose,
  item,
}) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedAddIns, setSelectedAddIns] = useState<Modifier[]>([]);
  const [selectedOption, setSelectionOption] = useState<SelectedOption>({
    _id: null,
  });
  const modifiers = item?.modifiers || [];
  const [total, setTotal] = useState(0);

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
    setSelectedAddIns((prev) => [...prev, { price: cost }]);
  };

  const onClickItem = (option: SelectedOption) => {
    setSelectionOption(option);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 0) setQuantity((prev) => prev - 1);
  };

  const calculateTotalPrice = () => {
    const basePrice =
      selectedOption?.itemVariationData?.priceMoney?.amount || 0;
    const modifierCost =
      selectedAddIns.reduce(
        (sum, modifier) => sum + (modifier.price || 0),
        0
      ) || 0;
    const myTotal = (basePrice + modifierCost) * quantity;
    setTotal(myTotal);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedAddIns, selectedOption, quantity]);

  const optionRender = (variations: SelectedOption[]) => {
    if (variations?.length < 2) {
      return null;
    }
    return (
      <div className="max-h-80 overflow-y-auto md:max-h-96">
        <div className="mb-4 bg-white py-2 dark:bg-slate-900">
          <h3 className="ml-4 text-lg font-semibold dark:text-white">
            Options
          </h3>
          <div className="ml-5  flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap dark:bg-slate-900">
            {variations?.map((value: any) => (
              <Button
                key={value._id}
                onClick={() => onClickItem(value)}
                size="large"
                className={`${
                  selectedOption?._id === value?._id
                    ? ' border-violet-800 !font-semibold text-violet-800 dark:border-none dark:bg-violet-700 dark:text-white dark:hover:!text-white'
                    : 'border-gray-400 text-gray-800 dark:border-gray-700'
                } !rounded-md border bg-white hover:border-violet-800 hover:text-violet-800 dark:border dark:bg-slate-900 dark:text-white dark:hover:!border-gray-600 dark:hover:!text-white  sm:px-6`}
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
  const onClickAddToCart = () => {
    handleClick();
    onClose();
    const deviceUuid = uuidv4();
    const myItem = {
      ...item,
      modifiers: selectedAddIns,
      id: deviceUuid,
      selectedAddIns,
      total,
      quantity,
      price: selectedOption?.itemVariationData?.priceMoney?.amount,
      variation: selectedOption,
    };
    setCart([...cart, myItem]);
  };
  return (
    <div
      className={`fixed inset-0 z-[1000] flex items-end justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={() => {
        setQuantity(0);
        onClose();
        handleAddInClick(0);
      }}
    >
      <div
        className={`w-full !rounded-t-3xl bg-white shadow-lg transition-transform duration-300 dark:bg-black sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl ${
          isVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-screen rounded-t-xl">
          <div className="relative bg-stone-100 shadow-xl dark:bg-black">
            <div className="mb-4 flex items-center bg-white py-4 dark:bg-black">
              <img
                src={
                  IMAGE_PATH +
                  (item && item.itemData
                    ? item.itemData.imageUrl
                    : 'default-image')
                }
                alt={item?.itemData?.name || 'Item'}
                className="mx-4 mt-2 size-20 rounded-md sm:size-20"
              />
              <div className="flex flex-col grow ">
                <h2 className="text-lg font-bold dark:text-white sm:text-lg">{item?.itemData?.name || 'Unknown Name'}</h2>
                <p className="text-sm mt-1 dark:text-gray-500 sm:text-sm">{item?.itemData?.description}</p>
              </div>
              <button
                onClick={() => {
                  setQuantity(0);
                  onClose();
                  handleAddInClick(0);
                }}
                className="mb-2 mr-5 text-lg font-bold text-black dark:text-white sm:mb-5 sm:mr-7 sm:text-2xl"
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
            <div className="relative bottom-0 mt-10 items-center rounded-t-3xl  bg-white p-4 py-5 shadow-md dark:bg-black">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="large"
                  onClick={decreaseQuantity}
                  className={`!mr-4 flex !w-[60px] items-center justify-center border-2 border-violet-800 bg-white !text-3xl font-black text-violet-800 sm:px-6 ${
                    quantity <= 0 ? 'cursor-not-allowed opacity-50' : ''
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
                  onClick={onClickAddToCart}
                  className="sm:w-98 mb-4 mt-5 !h-[60px] w-full bg-gradient-to-r from-violet-500 to-indigo-600 !text-xl text-white hover:bg-violet-700 hover:!text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:text-xl"
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
