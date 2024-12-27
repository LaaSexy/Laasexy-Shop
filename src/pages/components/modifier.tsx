import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
export interface Modifier {
  _id: string;
  uniqId: string;
  name: string;
  price: number;
}
export interface ModifierGroup {
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
    const tempModifiers: any = new Map(
      selectedVariation?.modifiers?.map((modifier: any) => [
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

    const updatedModifiers: any = new Map(addedModifiers);
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
      <div key={_id} className="flex-1 h-full overflow-y-auto">
        <div className="max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)]">
          <div className="bg-white dark:bg-slate-900">
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
                return (
                  <Button
                    key={item._id}
                    onClick={handleOnPressItem}
                    size="large"
                    className={`${
                      isSelected
                        ? ' border-violet-800 !font-semibold text-violet-800 dark:border-none dark:bg-violet-700 dark:text-white dark:hover:!text-white'
                        : 'border-gray-400 text-gray-800 dark:border-gray-700'
                    } !rounded-md border bg-white hover:border-violet-700 hover:text-violet-800 dark:border dark:bg-slate-900 dark:text-white dark:hover:!border-gray-600 dark:hover:!text-white sm:px-6`}
                  >
                    {item.name} {item.price > 0 ? `(+${item.price})` : ''}
                  </Button>
                );
              })}
            </div>
            <hr className="mt-3 border-gray-200 dark:border-gray-900"/>
          </div>
        </div>
      </div>
    );
  };
  return <div>{data.map(renderModifierGroup)}</div>;
};

export default Modifiers;
