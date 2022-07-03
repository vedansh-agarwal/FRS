import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  base_image: null,
  result: null,
  loading: false,
  base64img: null,
  error: null,
  face_encoding: null,
  extension: null,
  user_id: null,
  resultCode: null,
};

export const recognizeImage = createAsyncThunk(
  "image/recognizeImage",
  async (obj, { getState, rejectWithValue }) => {
    const data = await axios
      .post("http://localhost:3007/admin/recognizeface", {
        base64img: getState().image.base64img,
        user_id: getState().image.user_id,
        admin: getState().admin.username,
      })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          return rejectWithValue({ ...res.data, resultCode: res.status });
        } else if (res.status === 211) {
          return { ...res.data, resultCode: res.status };
        } else {
          return rejectWithValue({ ...res.data, resultCode: res.status });
        }
      })
      .catch((err) => {
        console.log(err);
        return rejectWithValue({
          ...err.response.data,
          resultCode: err.response.status,
        });
      });
    return data;
  }
);

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    addImageUpload: (state, action) => {
      state.base_image = action.payload.image;
      state.base64img = null;
      state.result = null;
      state.loading = false;
      state.error = null;
      state.face_encoding = null;
      state.extension = null;
      state.user_id = null;
    },
    addImageCamera: (state, action) => {
      console.log(action.payload);
      state.base64img = action.payload.image;
      state.base_image = null;
      state.result = null;
      state.loading = false;
      state.error = null;
      state.face_encoding = null;
      state.extension = null;
      if (action.payload.user_id) {
        state.user_id = action.payload.user_id;
      } else {
        state.user_id = null;
      }
    },
    resetImage: (state) => {
      state.base_image = null;
      state.result = null;
      state.loading = false;
      state.base64img = null;
      state.error = null;
      state.resultCode = null;
    },
    reset: (state) => {
      state.base_image = null;
      state.result = null;
      state.loading = false;
      state.base64img = null;
      state.error = null;
      state.face_encoding = null;
      state.extension = null;
      state.user_id = null;
      state.resultCode = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(recognizeImage.pending, (state) => {
      state.result = null;
      state.loading = true;
      state.error = null;
      state.resultCode = null;
    });
    builder.addCase(recognizeImage.fulfilled, (state, action) => {
      state.loading = false;
      state.result = action.payload.msg;
      state.extension = action.payload.extension;
      state.face_encoding = action.payload.face_encoding;
      state.user_id = action.payload.user_id;
      state.error = null;
      state.resultCode = action.payload.resultCode;
    });
    builder.addCase(recognizeImage.rejected, (state, action) => {
      state.result = false;
      state.loading = false;
      state.face_encoding = action.payload.face_encoding;
      state.extension = action.payload.extension;
      state.user_id = action.payload.user_id;

      state.error = action.payload.msg;
      state.resultCode = action.payload.resultCode;
    });
  },
});

export default imageSlice.reducer;
export const { resetImage, reset, addImageCamera, addImageUpload } =
  imageSlice.actions;
