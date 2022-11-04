import { List, Skeleton, Image, Tag } from 'antd';

import { Variation, Item } from '@/types/Item';

const MenuList = (props: any) => {
  const { data, feching } = props;

  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item: Item) => (
        <Skeleton avatar title loading={feching} active>
          <List.Item>
            <List.Item.Meta
              avatar={
                <Image
                  alt={item.itemData.name}
                  className="h-48 w-48 rounded-md"
                  src={`https://api.pointhub.io${item.itemData.imageUrl}`}
                  preview={false}
                />
              }
              title={item.itemData.name}
              description={item.itemData.variations.map(
                (variation: Variation) => (
                  <Tag key={`${variation.itemVariationData.name}`} color="gold">
                    {`${
                      item.itemData.variations.length > 1
                        ? `${variation.itemVariationData.name} -`
                        : ''
                    } ${variation.itemVariationData.priceMoney.amount} ${
                      variation.itemVariationData.priceMoney.currency
                    }`}
                  </Tag>
                )
              )}
            />
          </List.Item>
        </Skeleton>
      )}
    />
  );
};

export default MenuList;
