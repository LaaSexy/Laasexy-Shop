import { Button } from "antd";
import { add } from "lodash";
import React, { useState, useEffect } from "react";

// Define types for Modifier and props
interface Modifier {
  _id: string;
  uniqId: string;
  name: string;
  price: number;
}

interface ModifierGroup {
  modifiers: Modifier[];
  _id: string;
  type: string;
  isMultiple?: boolean;
}

interface ModifiersProps {
  selectedVariation?: any;
  onChanged?: (modifiers: Modifier[]) => void;
  data: ModifierGroup[];
}

const Modifiers: React.FC<ModifiersProps> = ({
  selectedVariation,
  onChanged = () => {},
  data = [],
}) => {
  const [addedModifiers, setAddedModifiers] = useState<Map<string, Modifier>>(
    new Map()
  );

  useEffect(() => {
    if (!selectedVariation) return;
    const tempModifiers = new Map(
      selectedVariation?.modifiers?.map((modifier) => [
        modifier.uniqId,
        modifier,
      ])
    );
    setAddedModifiers(tempModifiers);
  }, [selectedVariation]);

  const onPressItem = (
    modifier: Modifier,
    groupId: string,
    type: string,
    isMultiple: boolean
  ) => {
    const uniqId = isMultiple ? groupId + modifier._id : groupId;

    const updatedModifiers = new Map(addedModifiers);
    updatedModifiers.set(uniqId, { ...modifier, groupId, type, uniqId });

    setAddedModifiers(updatedModifiers);
    onChanged(Array.from(updatedModifiers.values()));
  };

  const onRemoveModifier = (groupId: string) => {
    const updatedModifiers = new Map(addedModifiers);
    updatedModifiers.delete(groupId);
    setAddedModifiers(updatedModifiers);
    onChanged(Array.from(updatedModifiers.values()));
  };

  const isSelectModifier = (uniqId: string, item: Modifier) => {
    return (
      addedModifiers.has(uniqId) && addedModifiers.get(uniqId)?._id === item._id
    );
  };

  const renderModifierGroup = ({
    modifiers,
    _id,
    type,
    isMultiple = false,
  }: ModifierGroup) => {
    return (
      <div key={_id}>
        <div className="max-h-80 overflow-y-auto md:max-h-96">
          <div className="bg-white py-3">
            <h3 className="ml-4 text-lg font-semibold">
              {isMultiple ? `${type}` : type}
            </h3>
            <div className="ml-4 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap">
              {modifiers.map((item) => {
                const uniqId = isMultiple ? _id + item._id : _id;
                const isSelected = isSelectModifier(uniqId, item);
                const handleOnPressItem = () => {
                  isSelected
                    ? onRemoveModifier(uniqId)
                    : onPressItem(item, _id, type, isMultiple);
                };
                // console.log("Item price: " + item.price);
                return (
                  <Button
                    key={item._id}
                    onClick={handleOnPressItem}
                    size="large"
                    className={`${
                      isSelected
                        ? "border-violet-800 text-violet-800 border-2 !font-semibold"
                        : "border-gray-400 text-gray-800"
                    } bg-white hover:border-violet-800 hover:text-violet-800 sm:px-6 border !rounded-md`}
                  >
                    {item.name} {item.price > 0 ? `(+${item.price})` : ""}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return <div>{data.map(renderModifierGroup)}</div>;
};

export default Modifiers;
