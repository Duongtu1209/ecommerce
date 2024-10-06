import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  access_token: "",
  phone: "",
  address: "",
  avatar: "",
  _id: "",
  isAdmin: false,
  city: "",
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = "",
        email = "",
        access_token = "",
        phone = "",
        address = "",
        avatar = "",
        _id = "",
        isAdmin,
        city = "",
      } = action.payload;
      state.name = name;
      state.email = email;
      state.access_token = access_token;
      state.phone = phone;
      state._id = _id;
      state.address = address;
      state.avatar = avatar;
      state.isAdmin = isAdmin;
      state.city = city;
    },

    resetUser: (state) => {
      state.name = "";
      state.email = "";
      state.access_token = "";
      state.phone = "";
      state.address = "";
      state.avatar = "";
      state._id = "";
      state.isAdmin = false;
      state.city = "";
    },
  },
});

export const { updateUser, resetUser } = userSlide.actions;

export default userSlide.reducer;
