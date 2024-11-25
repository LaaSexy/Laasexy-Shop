interface Modifier {
  index: number;
  name: string;
  price: number;
  _id: string;
}

type AddInsProps = {
  type: string; // or you can use a more specific type if applicable
  modifiers?: Modifier[]; // default is an empty array
  isMultiple?: boolean;
};
