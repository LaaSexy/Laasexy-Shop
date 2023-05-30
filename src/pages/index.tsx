import { useState } from 'react';

import { LeftOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { useRouter } from 'next/router';

import useItems from '@/hooks/useItems';
import { Meta } from '@/layout/Meta';
import CategoryList from '@/pages/components/category_list';
import MenuList from '@/pages/components/menu_list';
import { Main } from '@/templates/Main';
import { Category, Item } from '@/types/Item';

const Index = () => {
  const router = useRouter();
  const { query } = router;
  const [selectedCategory, setSelectedCategory] = useState<Category>();
  const { data, isFetching } = useItems(query);

  const [filterItems, setFilterItems] = useState<Item[]>();

  const onClickCategory = (category: Category) => {
    setSelectedCategory(category);
    const filterData: Item[] = _.filter(data, (item: Item) => {
      // eslint-disable-next-line no-underscore-dangle
      return item.itemData.categories.indexOf(category._id) > -1;
    });
    setFilterItems(filterData);
    window.scrollTo(0, 0);
  };

  return (
    <Main
      meta={
        <Meta
          title="Point hub"
          description="Point hub - next generation of loyalty and pos system"
        />
      }
    >
      {/* <ShopInfo query={query} /> */}
      {/* <ShopInfo /> */}

      {!selectedCategory ? (
        <CategoryList onClick={onClickCategory} query={query} />
      ) : (
        <>
          <div
            onClick={() => setSelectedCategory(undefined)}
            className="sticky top-0 z-10 flex flex-row items-center bg-white py-5 "
          >
            <LeftOutlined style={{ fontSize: '26px' }} />
            <span>
              &nbsp;<b>{selectedCategory?.name}</b>{' '}
            </span>
          </div>
          <MenuList feching={isFetching} data={filterItems} />
        </>
      )}
    </Main>
  );
};

export default Index;
