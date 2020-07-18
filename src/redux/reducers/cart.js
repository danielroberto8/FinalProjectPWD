const init_state = {
  cartQty: 0,
};

export default (state = init_state, action) => {
  switch (action.type) {
    case "ON_CART_CHANGE":
      return {
        ...init_state,
        cartQty: action.payload,
      };
    case "ON_CART_DELETE":
      return {
        ...init_state,
        cartQty: state.cartQty - 1,
      };
    default:
      return { ...init_state };
  }
};
