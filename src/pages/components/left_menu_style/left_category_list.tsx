import React, { useEffect } from 'react';

import { List } from 'antd';

import { Category } from '@/types/Item';

// const imageUrl = process.env.NEXT_PUBLIC_API_URL;
const CategoryList = (props: any) => {
  const { data, onClick = () => {}, selectedCategoryId, style } = props;

  useEffect(() => {
    if (selectedCategoryId === '' && !!data) {
      onClick(data[0]);
    }
  }, [data, selectedCategoryId, onClick]);

  const onClickCategory = (category: Category) => {
    onClick(category);
  };

  return (
    <List
      style={style}
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item: Category) => (
        <div
          // eslint-disable-next-line no-underscore-dangle
          key={item._id}
          className={`my-2 rounded-md ${
            // eslint-disable-next-line no-underscore-dangle
            selectedCategoryId === item._id
              ? 'bg-violet-600'
              : 'bg-white dark:bg-slate-900'
          }`}
        >
          <button
            onClick={() => onClickCategory(item)}
            className="h-full w-full rounded-md  border border-violet-100 py-2 px-1 dark:border-gray-900"
          >
            <span
              className={`z-10 m-0 p-0 text-left text-sm ${
                // eslint-disable-next-line no-underscore-dangle
                selectedCategoryId === item._id
                  ? ' text-white'
                  : ' text-black dark:text-white'
              } drop-shadow-md`}
            >
              {item.name}
            </span>
            <br />
          </button>
        </div>
      )}
    />
  );
};

export default CategoryList;
