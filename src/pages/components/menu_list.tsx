import { List, Skeleton, Image, Tag, Card } from 'antd';

import { Variation, Item } from '@/types/Item';
import { formatCurrency } from '@/utils/numeral';

const imagePath = 'https://api.pointhub.io';
const MenuList = (props: any) => {
  const { data, fetching } = props;

  return (
    <List
      grid={{ xs: 2, sm: 2, lg: 4, xl: 4, xxl: 4, gutter: 5 }}
      dataSource={data}
      renderItem={(item: Item) => (
        <Skeleton avatar title loading={fetching} active>
          <List.Item>
            <Card
              cover={
                <Image
                  alt={item.itemData.name}
                  className="max-h-80  w-48 rounded-md object-contain"
                  src={imagePath + item.itemData.imageUrl}
                />
              }
            >
              {item.itemData.name}
              <br />
              {item.itemData.variations.map((variation: Variation) => (
                <Tag key={`${variation.itemVariationData.name}`} color="gold">
                  {`${
                    item.itemData.variations.length > 1
                      ? `${variation.itemVariationData.name} -`
                      : ''
                  } ${formatCurrency(
                    variation.itemVariationData.priceMoney.amount,
                    variation.itemVariationData.priceMoney.currency
                  )}`}
                </Tag>
              ))}
            </Card>
          </List.Item>
        </Skeleton>
      )}
    />
  );
};

export default MenuList;
