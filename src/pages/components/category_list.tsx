import { List } from 'antd';
import _ from 'lodash';

import useCategories from '@/hooks/useCategories';
import { Category } from '@/types/Item';
// import useItems from '@/hooks/useItems';
// import MenuList from './menu_list';
// import { useState } from 'react';

const CategoryList = (props: any) => {
  const { query, onClick = () => {} } = props;
  const { data, isFetching } = useCategories(query);

  return (
    <List
      itemLayout="horizontal"
      dataSource={_.orderBy(data, ['index'], ['asc'])}
      loading={isFetching}
      renderItem={(item: Category) => (
        <div
          // style={{
          //   backgroundImage: `url("https://cdn.pixabay.com/photo/2017/01/26/02/06/platter-2009590__340.jpg")`,
          // }}
          // className="my-2 items-center rounded-md shadow-md drop-shadow-md"
          className="my-2 items-center rounded-md bg-gradient-to-r from-blue-500 to-transparent "
        >
          <button
            onClick={() => onClick(item)}
            className="h-full w-full rounded-md bg-black/20 py-8  backdrop-brightness-50"
          >
            <p className="z-10 text-center font-sans text-3xl font-bold text-white">
              {item.name}
            </p>
          </button>
        </div>
      )}
    />
  );
};

export default CategoryList;
