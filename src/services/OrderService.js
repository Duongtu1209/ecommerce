import { axiosJWT } from "./UserService";

export const createOrder = async (access_token, data) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_URL_BACKEND}/order/create`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};


export const getOrderByUser = async (access_token, id) => {  
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_URL_BACKEND}/order/get-order-by-user/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const getOrderDetail = async (access_token, id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_URL_BACKEND}/order/get-order-detail/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const cancelOrder = async (access_token, id) => {
    const res = await axiosJWT.delete(
        `${process.env.REACT_APP_URL_BACKEND}/order/cancel-order/${id}`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};

export const getAll = async (access_token) => {
    const res = await axiosJWT.get(
        `${process.env.REACT_APP_URL_BACKEND}/order/get-all`,
        {
            headers: {
                token: `Bearer ${access_token}`,
            },
        }
    );
    return res.data;
};
