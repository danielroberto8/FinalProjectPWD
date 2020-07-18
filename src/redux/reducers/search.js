const init_state = {
  searchTerm: "",
};

export default (state = init_state, action) => {
  switch (action.type) {
    case "ON_USER_SEARCH":
      return { ...state, searchTerm: action.payload };
    default:
      return { ...state };
  }
};
