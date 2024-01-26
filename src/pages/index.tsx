import React, { useState } from 'react';

import _ from 'lodash';
import { useRouter } from 'next/router';

import { useV2Items } from '@/hooks/useItems';
import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';
import { Category, Item } from '@/types/Item';

import { LeftCategoryList, LeftMenuList } from './components/left_menu_style';
import MultipleSkeletons from './components/MultipleSkeletons';
import ShopInfo from './components/shop_info';

const Index = () => {
  const router = useRouter();
  const { query } = router;
  const { data: shopV2Data, isFetching = true } = useV2Items(query?.branch);

  const [filterItems, setFilterItems] = useState<Item[]>();

  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const onClickCategory = (category: Category) => {
    // eslint-disable-next-line no-underscore-dangle
    setSelectedCategoryId(category._id);
    const filterData: Item[] = _.filter(shopV2Data?.items, (item: Item) => {
      // eslint-disable-next-line no-underscore-dangle
      return item.itemData.categories.indexOf(category._id) > -1;
    });
    setFilterItems(filterData);
  };

  return (
    <Main
      meta={
        <Meta
          title={
            !shopV2Data?.shop?.name
              ? 'Point hub'
              : `Point hub - ${shopV2Data?.shop?.name}`
          }
          description="Point hub - Your bussiness in your hand."
        />
      }
    >
      <MultipleSkeletons itemCount={10} loading={isFetching}>
        <ShopInfo data={shopV2Data?.shop} />
        <div className="flex h-[75vh] px-1">
          <div className="hide-scrollbar w-[130px] overflow-auto    md:w-1/5">
            {/* Content for Row 1 */}
            <LeftCategoryList
              selectedCategoryId={selectedCategoryId}
              onClick={onClickCategory}
              data={shopV2Data?.subCategories}
            />
          </div>
          <div className="hide-x-scroll flex-1 px-1 ">
            {/* Content for Row 2 */}
            <LeftMenuList
              currency={shopV2Data?.shop?.currency}
              data={filterItems}
            />
          </div>
        </div>
      </MultipleSkeletons>
    </Main>
  );
};

export default Index;
