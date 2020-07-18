import { combineReducers } from "redux";
import userReducer from "./user";
import searchReducer from "./search";
import cartReducer from "./cart";

export default combineReducers({
  user: userReducer,
  search: searchReducer,
  cart: cartReducer,
});
