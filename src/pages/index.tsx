import React, { useEffect, useRef, useState } from 'react';

import { LeftOutlined } from '@ant-design/icons';
// import { Content } from 'antd/es/layout/layout';
import _ from 'lodash';
import { useRouter } from 'next/router';

import useItems from '@/hooks/useItems';
import { Meta } from '@/layout/Meta';
import CategoryList from '@/pages/components/category_list';
import MenuList from '@/pages/components/menu_list';
import { Main } from '@/templates/Main';
import { Category, Item } from '@/types/Item';

import ShopInfo from './components/shop_info';

const Index = () => {
  const router = useRouter();
  const { query } = router;
  const menuRef = useRef<null | HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const { data, isFetching } = useItems(query);

  const [filterItems, setFilterItems] = useState<Item[]>();

  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (selectedCategory) {
      setTimeout(() => {
        menuRef?.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 20);
    }
  }, [selectedCategory]);

  const onClickCategory = (category: Category) => {
    setSelectedCategory(category);
    // eslint-disable-next-line no-underscore-dangle
    setSelectedCategoryId(category._id);
    const filterData: Item[] = _.filter(data, (item: Item) => {
      // eslint-disable-next-line no-underscore-dangle
      return item.itemData.categories.indexOf(category._id) > -1;
    });
    setFilterItems(filterData);
    // window.scrollTo(0, 0);
  };

  return (
    <Main
      meta={
        <Meta
          title="Point hub"
          description="Point hub - Your bussiness in your hand."
        />
      }
    >
      <ShopInfo query={query} />
      <div className="px-2" ref={menuRef}>
        {!selectedCategory ? (
          <CategoryList
            selectedCategoryId={selectedCategoryId}
            onClick={onClickCategory}
            query={query}
          />
        ) : (
          <>
            <div
              onClick={() => setSelectedCategory(undefined)}
              className="sticky top-0 z-10 flex flex-row items-center bg-white py-5 dark:bg-black"
            >
              <LeftOutlined style={{ fontSize: '26px' }} />
              <span className="dark:text-white">
                &nbsp;<b>{selectedCategory?.name}</b>{' '}
              </span>
            </div>
            <MenuList feching={isFetching} data={filterItems} />
          </>
        )}
      </div>
    </Main>
  );
};

export default Index;
