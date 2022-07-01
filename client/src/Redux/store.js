import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import recognizeReducer from "./reducers/recognizeReducer";
import user from "./reducers/userReducer";
import modify from "./reducers/modify";
import add from "./reducers/add";
import userSlice from "./reducers/getFace";

export const store = configureStore({
  reducer: {
    // reducer
    user,
    recognize: recognizeReducer,
    add,
    modify,
    result: userSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
