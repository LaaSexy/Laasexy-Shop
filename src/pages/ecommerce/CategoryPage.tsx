import React, { useEffect, useState } from 'react';
import { UnorderedListOutlined, AppstoreOutlined } from '@ant-design/icons';
import { Avatar, Button, List, Empty } from 'antd';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useV2Items } from '@/hooks/useItems';
import { formatCurrency } from '@/utils/numeral';
import MultipleSkeletons from '../components/MultipleSkeletons';
import ProductDetail from './ProductDetail';

export const imagePath = 'https://api.pointhub.io';

export const generateDeviceId = () => {
  return Math.floor(Math.random() * 100000) + '-' + Date.now();
};

interface CategoryPageProps {
  currency: string;
  filterItems: any;
  selectedItem?: any;
  onItemClick?: (item: any) => void;
  onClose: () => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  currency,
  filterItems = [],
  selectedItem,
  onItemClick,
  onClose,
}) => {
  const [, setSelectedCategory] = useState<number | null>(null);
  const [showCart, setShowCart] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedShowCart = localStorage.getItem('showCart');
      return savedShowCart ? JSON.parse(savedShowCart) : true;
    }
    return true;
  });
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('showCart', JSON.stringify(showCart));
    }
  }, [showCart]);

  useEffect(() => {
    if (shopV2Data?.subCategories) {
      onClickCategory(shopV2Data?.subCategories?.[0]);
    }
  }, [shopV2Data]);

  const onClickCategory = (category: any) => {
    setSelectedCategory(category._id);
  };

  const onClickItem = (item: any) => {
    if (onItemClick) {
      onItemClick(item);
    }
  };

  const GridContent = () => (
    <div className="w-full overflow-hidden bg-white dark:bg-black px-4 sm:px-14">
      <div className="mb-10 mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filterItems.map((item: any) => (
          <div
            key={item._id}
            onClick={() => onClickItem(item)}
            className="rounded-lg bg-white text-center shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:bg-slate-900 cursor-pointer"
          >
            <img
              alt={item?.itemData?.name || 'Product Image'}
              src={
                item?.itemData?.imageUrl
                  ? `${imagePath}${item.itemData.imageUrl}`
                  : '/placeholder-image.jpg'
              }
              className="mx-auto mb-4 mt-1 h-[160px] w-[210px] rounded-md object-cover sm:h-[205px] sm:w-[260px] transition duration-300 ease-in-out hover:scale-105"
            />
            <div className="mx-5 mb-4">
              <h2 className="mb-2 text-start text-sm text-black dark:text-white">
                {item?.itemData?.name || 'Unnamed Product'}
              </h2>
              <div className="flex items-center justify-between">
                <h5 className="mt-2 text-lg font-bold text-violet-700 dark:text-white">
                  {formatCurrency(
                    item?.itemData?.variations?.[0]?.itemVariationData?.priceMoney
                      ?.amount || 0,
                    currency
                  )}
                </h5>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className="mt-2 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500 font-bold text-violet-700 dark:border-none dark:bg-violet-500 dark:text-white dark:hover:!text-white"
                >
                  <img
                    src="/assets/images/add-to-cart.png"
                    alt="Add to Cart Icon"
                    className="size-4"
                  />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ListContent = () => (
    <div className="w-full bg-white dark:bg-black">
      <List
        className=" bg-white px-4 mb-10 mt-3 dark:bg-black sm:px-14"
        loading={isFetching}
        itemLayout="horizontal"
        dataSource={filterItems}
        renderItem={(item: any) => (
          <List.Item>
            <div
              onClick={() => onClickItem(item)}
              className="flex w-full justify-between rounded-md border shadow-[0_3px_10px_rgb(0,0,0,0.2)] dark:border-gray-700 dark:bg-slate-900"
            >
              <div className="flex w-full items-center sm:w-auto">
                <Avatar
                  src={
                    item?.itemData?.imageUrl
                      ? `${imagePath}${item.itemData.imageUrl}`
                      : '/placeholder-image.jpg'
                  }
                  className="m-2 size-20 rounded-md sm:size-28 transition duration-300 ease-in-out hover:scale-105"
                />
                <div>
                  <h3 className="mb-3 text-sm text-black dark:text-white">
                    {item?.itemData?.name || 'Unnamed Product'}
                  </h3>
                  <p className="!w-5 text-lg font-bold text-violet-700 dark:text-white sm:w-4">
                    {formatCurrency(
                      item.itemData.variations[0]?.itemVariationData.priceMoney
                        .amount,
                      currency
                    )}
                  </p>
                </div>
              </div>
              <div className="mr-5 flex items-center gap-4">
                <div>
                  <Button className="mt-10 flex h-[30px] w-[50px] items-center justify-center rounded-md bg-violet-500  text-base font-bold text-violet-700 dark:border-none  dark:bg-violet-500 dark:text-white dark:hover:!text-white">
                    <img
                      src="/assets/images/add-to-cart.png"
                      alt="Add to Cart Icon"
                      className="size-4"
                    />
                  </Button>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <MultipleSkeletons loading={isFetching}>
      <div className="container mx-auto flex min-h-screen max-w-full flex-col">
        <div className="flex min-h-screen flex-col bg-white dark:bg-black">
            {/* Navigation */}
            <div className="flex justify-end items-center pr-4 mt-5">
              <Button
                size="large"
                onClick={() => setShowCart(!showCart)}
                className="flex items-center justify-center bg-violet-500 text-xl text-white hover:!text-white dark:border-none"
                aria-label="Open Options"
              >
                {showCart ? <UnorderedListOutlined /> : <AppstoreOutlined />}
              </Button>
            </div>
          {/* Main Content */}
          {selectedItem ? (
            <ProductDetail
              currency={currency}
              item={selectedItem}
              onClose={onClose}
            />
          ) : filterItems.length === 0 ? (
            <Empty className="mt-10" description="No items found" />
          ) : showCart ? (
            <GridContent />
          ) : (
            <ListContent />
          )}
        </div>
      </div>
    </MultipleSkeletons>
  );
};

export default CategoryPage;