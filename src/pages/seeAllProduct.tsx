import React, { useEffect } from 'react';

import { LeftOutlined } from '@ant-design/icons';
import { Button, List } from 'antd';
import { useRouter } from 'next/router';

import { useV2Items } from '@/hooks/useItems';

import MultipleSkeletons from './components/MultipleSkeletons';

const SeeAllProduct = () => {
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);

  useEffect(() => {
    console.log(shopV2Data);
  }, [shopV2Data]);

  const onClickToShowData = () => {
    if (query?.branch && query?.table) {
      router.push({
        pathname: '/ecommerce',
        query: {
          branch: query.branch,
          table: query.table,
        },
      });
    }
  };

  return (
    <MultipleSkeletons loading={isFetching}>
      {shopV2Data?.subCategories?.length <= 0 ? (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600 dark:text-white">
            No subcategories found.
          </p>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col">
          <div className="relative flex min-h-screen max-w-full flex-col bg-white dark:bg-black">
            {/* Sticky Header */}
            <header className="sticky top-0 z-10 flex w-full items-center justify-between rounded-b-lg bg-white py-2 shadow-md dark:bg-black dark:shadow-[0_4px_6px_rgba(255,255,255,0.1)] sm:py-2">
              <Button
                className="float-left flex items-center justify-center border-none !p-5 text-2xl shadow-none hover:text-black active:!border-none active:outline-none dark:bg-black dark:hover:!text-white sm:text-2xl"
                onClick={onClickToShowData}
              >
                <LeftOutlined />
              </Button>
              <div className="mr-16 flex w-full items-center justify-center">
                <h2 className="text-center text-2xl font-bold dark:text-white sm:text-xl md:text-2xl">
                  All Categories
                </h2>
              </div>
              <div className="flex items-center justify-end">
                {/* Add additional header elements here if needed */}
              </div>
            </header>
            {/* Main Content */}
            <main className="mb-28 flex-1 overflow-y-auto px-2 pt-4 sm:px-4">
              <div className="w-full">
                <List
                  className="rounded-md"
                  dataSource={shopV2Data?.subCategories || []}
                  itemLayout="horizontal"
                  renderItem={(subCategory: any) => (
                    <List.Item key={subCategory?.id || subCategory?.name}>
                      <div className="flex w-full items-center justify-between rounded-lg border bg-white p-1 shadow-sm dark:border-gray-700 dark:bg-slate-900">
                        <div className="flex items-start">
                          {subCategory?.emoji ? (
                            <div className="mx-auto ml-5 mt-5 size-14 text-2xl">
                              {subCategory.emoji}
                            </div>
                          ) : (
                            <img
                              alt="Default Product"
                              src="/assets/images/default.png"
                              className="mx-auto mr-3 size-16 rounded-md object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  '/assets/images/default.png';
                              }}
                            />
                          )}
                          <div className="mt-1 w-48 text-gray-700 dark:text-white sm:mt-3">
                            <p className="truncate text-sm font-bold text-gray-700 dark:text-white">
                              {subCategory?.name || 'Unknown'}
                            </p>
                            <p className="truncate text-xs text-gray-600 dark:text-gray-300 sm:w-[500px]">
                              {subCategory?.itemData?.subName || ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </main>
          </div>
        </div>
      )}
    </MultipleSkeletons>
  );
};

export default SeeAllProduct;
