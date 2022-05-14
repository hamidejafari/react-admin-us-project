import { combineReducers } from "redux";

import siteSlice from "./slices/siteSlice";
import userSlice from "./slices/userSlice";
import flagSlice from "./slices/flagSlice";
import countSlice from "./slices/countSlice";

const rootReducer = combineReducers({
  site: siteSlice,
  user: userSlice,
  flag: flagSlice,
  count: countSlice
});

export default rootReducer;