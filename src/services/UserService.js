import axios from "axios";

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/user/sign-in`,
    data
  );
  return res.data;
};

export const signUpUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_URL_BACKEND}/user/sign-up`,
    data
  );
  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  const res = await axios.get(
    `${process.env.REACT_APP_URL_BACKEND}/get-details/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
