import { useEffect, useRef, useState } from 'react';
import { List, Skeleton, Image, Tag, Card } from 'antd';
import { Item } from '@/types/Item';
import { formatCurrency } from '@/utils/numeral';
import ItemDetailModal from '../ItemDetailModal';
import ProductDetail from '@/pages/ecommerce/ProductDetail';

const imagePath = 'https://api.pointhub.io';

const ItemRender = (props: any) => {
  const { item, currency, lang, onClick } = props;
  return (
    <List.Item className="max-w-md" onClick={onClick}>
      <Card
        cover={
          <Image
            alt={item.itemData.name}
            className="max-h-80 w-48 max-w-xs rounded-md object-contain"
            src={imagePath + item.itemData.imageUrl}
            preview={false}
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
        <Tag
          key={`${item.itemData.variations[0]?.itemVariationData.name}`}
          color="gold"
          className="px-3 py-1"
        >
          <span className="text-sm font-bold">
            {formatCurrency(
              item.itemData.variations[0]?.itemVariationData.priceMoney.amount,
              currency
            )}
          </span>
        </Tag>
      </Card>
    </List.Item>
  );
};

const MenuList = (props: any) => {
  const { data, fetching, currency = 'USD', lang = '1' } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  const onClickItem = (item: Item) => {
    setSelectedItem(item);
  };

  const onCancel = () => {
    setSelectedItem(null);
  };

  return (
    <div>
      <div ref={listRef} className="hide-x-scroll max-h-[75vh]">
        <List
          grid={{ xs: 2, sm: 2, lg: 4, xl: 4, xxl: 4, gutter: 10 }}
          dataSource={data}
          className="py-3"
          style={{ scrollBehavior: 'smooth' }}
          renderItem={(item: Item) => (
            <Skeleton avatar title loading={fetching} active>
              <ItemRender
                lang={lang}
                item={item}
                currency={currency}
                onClick={() => onClickItem(item)}
              />
            </Skeleton>
          )}
        />
      </div>
      {selectedItem && (
        <>
          {/* ItemDetailModal for smaller screens */}
          <div className="block lg:hidden">
            <ItemDetailModal
              currency={currency}
              isVisible={!!selectedItem}
              onClose={onCancel}
              item={selectedItem}
            />
          </div>

          {/* ProductDetail for larger screens */}
          <div className="hidden lg:block">
            <ProductDetail
              currency={currency}
              item={selectedItem}
              onClose={onCancel}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MenuList;