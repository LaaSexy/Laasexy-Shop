import { useRouter } from 'next/router';

import { Meta } from '@/layout/Meta';
import MenuList from '@/pages/components/menu_list';
import ShopInfo from '@/pages/components/shop_info';
import { Main } from '@/templates/Main';
// import useCategories from '@/hooks/useCategories';

const Menu = () => {
  const router = useRouter();
  // const { data, isFetching } = useCategories(router.query);

  return (
    <Main
      meta={
        <Meta
          title="Point hub"
          description="Point hub is a leading point of sale system in Cambodia."
        />
      }
    >
      <ShopInfo />
      <MenuList query={router.query} />
      {/* <ShopInfo query={router.query}/>
      <CategoryList query={router.query} /> */}
    </Main>
  );
};

export default Menu;
