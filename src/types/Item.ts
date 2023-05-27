// sub-categories/shop/
export type ItemData = {
  name: string;
  imageUrl: string;
  variations: [Variation];
  categories: [string];
};

export type Variation = {
  itemVariationData: {
    name: string;
    priceMoney: {
      amount: Number;
      currency: string;
    };
  };
  _id: string;
};

export type Item = {
  itemData: ItemData;
};

export type Category = {
  _id: string;
  index: Number;
  name: string;
  imageUrl?: string;
};
