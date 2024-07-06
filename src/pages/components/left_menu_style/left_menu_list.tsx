import { useEffect, useRef, useState } from 'react';

import { List, Skeleton, Image, Tag, Card, Badge, Popover } from 'antd';

import { Item, Variation } from '@/types/Item';
import { formatCurrency } from '@/utils/numeral';

const imagePath = 'https://api.pointhub.io';

const ItemRender = (props: any) => {
  const { item, currency, lang } = props;
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <List.Item className="max-w-md ">
      <Card
        cover={
          <Image
            alt={item.itemData.name}
            className=" max-h-80 w-48 max-w-xs rounded-md object-contain"
            src={imagePath + item.itemData.imageUrl}
          />
        }
        bodyStyle={{
          padding: 8,
        }}
      >
        {lang === '2'
          ? item.itemData.subName || item.itemData.name
          : item.itemData.name}
        <br />
        {item.itemData.variations.length > 1 ? (
          <Popover
            content={
              <div className="grid grid-cols-1 gap-2">
                <p>Options</p>
                {item.itemData.variations.map((variation: Variation) => (
                  <Tag
                    className="cursor-pointer px-3 py-1"
                    key={`${variation.itemVariationData.name}`}
                    color="gold"
                  >
                    <span className="text-sm">
                      {`${
                        item.itemData.variations.length > 1
                          ? `${variation.itemVariationData.name} -`
                          : ''
                      } ${formatCurrency(
                        variation.itemVariationData.priceMoney.amount,
                        currency
                      )}`}
                    </span>
                  </Tag>
                ))}
              </div>
            }
            title={item.itemData.name}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
          >
            <Badge
              offset={[0, 8]}
              count={item.itemData.variations.length}
              color={'purple'}
            >
              <Tag
                key={`${item.itemData.variations[0].itemVariationData.name}`}
                color="gold"
                className="cursor-pointer px-3 py-1"
              >
                <span className="text-sm font-bold">
                  {formatCurrency(
                    item.itemData.variations[0].itemVariationData.priceMoney
                      .amount,
                    currency
                  )}
                </span>
              </Tag>
            </Badge>
          </Popover>
        ) : (
          <Tag
            key={`${item.itemData.variations[0]?.itemVariationData.name}`}
            color="gold"
            className="px-3 py-1"
          >
            <span className="text-sm font-bold">
              {formatCurrency(
                item.itemData.variations[0]?.itemVariationData.priceMoney
                  .amount,
                currency
              )}
            </span>
          </Tag>
        )}
      </Card>
    </List.Item>
  );
};
const MenuList = (props: any) => {
  const { data, fetching, currency = 'USD', lang = '1' } = props;
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  return (
    <div ref={listRef} className="hide-x-scroll" style={{ maxHeight: '75vh' }}>
      <List
        grid={{ xs: 2, sm: 2, lg: 4, xl: 4, xxl: 4, gutter: 10 }}
        dataSource={data}
        className="py-3"
        style={{ scrollBehavior: 'smooth' }}
        renderItem={(item: Item) => (
          <Skeleton avatar title loading={fetching} active>
            <ItemRender lang={lang} item={item} currency={currency} />
          </Skeleton>
        )}
      />
    </div>
  );
};

export default MenuList;
