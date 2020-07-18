export const onCartChange = (value) => {
  return {
    type: "ON_CART_CHANGE",
    payload: value,
  };
};

export const onCartDelete = () => {
  return {
    type: "ON_CART_DELETE",
  };
};
