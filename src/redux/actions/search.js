export const searchHandler = (text) => {
  return {
    type: "ON_USER_SEARCH",
    payload: text,
  };
};
