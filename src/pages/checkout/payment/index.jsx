import { Form, message, Radio } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import ButtonComponent from "../../../components/Button/Button";
import {
  Label,
  WrapperInfo,
  WrapperLeft,
  WrapperRadio,
  WrapperRight,
  WrapperTotal,
} from "../style";
import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../../services/utils";
import { ModalComponent } from "../../../components/Modal/Modal";
import InputComponent from "../../../components/Input/Input";
import { useMutationHook } from "../../../hooks/useMutationHook";
import * as UserService from "../../../services/UserService";
import * as OrderService from "../../../services/OrderService";

import Loading from "../../../components/Loading/Loading";
import { updateUser } from "../../../redux/sliders/userSlider";
import { useNavigate } from "react-router-dom";
import { removeAll } from "../../../redux/sliders/cartSlider";

const calculateShippingFee = (totalPrice, delivery) => {
  const shippingFees = [
    { minPrice: 1, maxPrice: 5000000, fee: 50000 },
    { minPrice: 5000001, maxPrice: 10000000, fee: 30000 },
    { minPrice: 10000001, maxPrice: 20000000, fee: 20000 },
    { minPrice: 20000001, maxPrice: Infinity, fee: 0 },
  ];

  const deliveryFees = {
    fast: 30000,
    gojek: 0,
  };

  const applicableFee = shippingFees.find(
    (fee) => totalPrice >= fee.minPrice && totalPrice <= fee.maxPrice
  );

  return applicableFee
    ? applicableFee.fee + (deliveryFees[delivery] || 0)
    : 0 + (deliveryFees[delivery] || 0);
};
const Payment = () => {
  const cart = useSelector((state) => state?.cart);
  const user = useSelector((state) => state?.user);

  const navigate = useNavigate();

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("COD");

  const [isModalUpdateInfo, setIsModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    address: "",
    avatar: "",
    city: "",
    image: "",
  });
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isModalUpdateInfo) {
      setStateUserDetails({
        ...user,
        email: user?.email,
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalUpdateInfo, user]);

  const subTotal = useMemo(() => {
    const result = cart?.cartItemsSelected?.reduce((total, cur) => {
      return total + cur?.price * cur?.quantity;
    }, 0);
    return result;
  }, [cart]);

  const totalDiscount = useMemo(() => {
    const result = cart?.cartItemsSelected?.reduce((total, cur) => {
      const itemDiscount = (cur?.price * cur?.discount * cur?.quantity) / 100;
      return total + itemDiscount;
    }, 0);
    return result || 0;
  }, [cart]);

  const grandTotal = useMemo(() => {
    return subTotal - totalDiscount;
  }, [subTotal, totalDiscount]);

  const shippingFee = useMemo(
    () => calculateShippingFee(grandTotal, delivery),
    [grandTotal, delivery]
  );

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const mutationPlaceOrder = useMutationHook((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder(token, { ...rests });
    return res;
  });

  const { isPending, data } = mutationUpdate;
  const {
    data: placeOrderData,
    isPending: isPendingPlaceOrder,
    isSuccess,
    isError,
  } = mutationPlaceOrder;

  useEffect(() => {
    if (isSuccess && placeOrderData?.status === "OK") {
      const arrOrdered = cart?.cartItemsSelected.map((item) => item.product);
      dispatch(removeAll({ ids: arrOrdered }));
      message.success("Đặt hàng thành công");

      navigate("/checkout/orderSuccess", {
        state: {
          delivery,
          payment,
          order: cart?.cartItemsSelected,
          grandTotal: grandTotal,
        },
      });
    } else if (isError) {
      message.error("Đặt hàng không thành công. Hãy thử lại!");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]); 

  const handlePlaceOrder = () => {
    mutationPlaceOrder.mutate({
      token: user?.access_token,
      orderItems: cart?.cartItemsSelected,
      shippingAddress: {
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
      },
      paymentMethod: payment,
      subTotal: subTotal,
      discountAmount: totalDiscount,
      shippingFee: shippingFee,
      grandTotal: grandTotal,
      user: user?._id,
    });
  };

  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      city: "",
    });
    form.resetFields();
    setIsModalUpdateInfo(false);
  };

  const handleUpdateUserInfo = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        {
          id: user?._id,
          token: user?.access_token,
          ...stateUserDetails,
        },
        {
          onSuccess: () => {
            message.success("Cập nhật thông tin giao hàng thành công");
            dispatch(updateUser({ name, address, city, phone }));
            setIsModalUpdateInfo(false);
          },
        }
      );
    }
  };

  const handleInputChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelivery = (e) => {
    setDelivery(e.target.value);
  };

  const handlePayment = (e) => {
    setPayment(e.target.value);
  };

  return (
    <div
      style={{
        paddingTop: 10,
        background: "#f5f5fa",
        width: "100%",
        minHeight: "100vh",
        height: "100%",
      }}
    >
      <Loading isPending={isPendingPlaceOrder}>
        <div style={{ height: "100%", width: 1600, margin: "0 auto" }}>
          <h3>Thanh toán</h3>
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <WrapperLeft>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức giao hàng</Label>
                  <WrapperRadio onChange={handleDelivery} value={delivery}>
                    <Radio value="fast" onClick={(e) => e.preventDefault()}>
                      <span
                        style={{
                          color: "#ea8500",
                          fontWeight: "bold",
                          marginRight: 10,
                        }}
                      >
                        FAST
                        <span
                          style={{
                            color: "#252525",
                            fontWeight: "normal",
                            marginLeft: 10,
                          }}
                        >
                          Giao hàng hoả tốc
                        </span>
                      </span>
                    </Radio>
                    <Radio value="gojek" onClick={(e) => e.preventDefault()}>
                      <span
                        style={{
                          color: "#ea8500",
                          fontWeight: "bold",
                          marginRight: 10,
                        }}
                      >
                        GO-JEK
                        <span
                          style={{
                            color: "#252525",
                            fontWeight: "normal",
                            marginLeft: 10,
                          }}
                        >
                          Giao hàng tiết kiệm
                        </span>
                      </span>
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Label>Chọn phương thức thanh toán</Label>
                  <WrapperRadio onChange={handlePayment} value={payment}>
                    <Radio value="COD" onClick={(e) => e.preventDefault()}>
                      <span style={{ color: "#252525", fontSize: 14 }}>
                        Thanh toán tiền mặt khi nhận hàng
                      </span>
                    </Radio>
                  </WrapperRadio>
                </div>
              </WrapperInfo>
            </WrapperLeft>
            <WrapperRight>
              <div style={{ width: "100%" }}>
                <WrapperInfo>
                  <div>
                    <span>Địa chỉ:</span>
                    <div
                      style={{
                        display: "flex",
                        gap: 20,
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          color: "rgb(37, 37, 37)",
                          textDecoration: "underline",
                        }}
                      >{`${user?.address} ${user?.city}`}</span>
                      <span
                        style={{
                          color: "rgb(10, 104, 255)",
                          cursor: "pointer",
                        }}
                        onClick={() => setIsModalUpdateInfo(true)}
                      >
                        Đổi
                      </span>
                    </div>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tạm tính</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(subTotal)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span> Giảm giá </span>
                    <span
                      style={{
                        color: "rgb(255, 66, 78)",
                        fontSize: 15,
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(totalDiscount)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Phí giao hàng</span>
                    <span
                      style={{
                        color: "#000",
                        fontSize: 14,
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(shippingFee)}
                    </span>
                  </div>
                </WrapperInfo>
                <WrapperTotal>
                  <span>Tổng tiền</span>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span
                      style={{
                        color: "rgb(254, 56, 52)",
                        fontSize: 24,
                        fontWeight: "bold",
                      }}
                    >
                      {convertPrice(grandTotal)}
                    </span>
                    <span style={{ color: "#000", fontSize: 11 }}>
                      (Đã bao gồm VAT nếu có)
                    </span>
                  </span>
                </WrapperTotal>
              </div>
              <div style={{ width: "100%" }}>
                <ButtonComponent
                  onClick={() => handlePlaceOrder()}
                  size={40}
                  styleButton={{
                    background: "rgb(255, 57, 69)",
                    height: 48,
                    width: "100%",
                    border: "none",
                    borderRadius: 4,
                    fontWeight: "bold",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                  textbutton="Đặt hàng"
                />
              </div>
            </WrapperRight>
          </div>
        </div>
        <ModalComponent
          title="Cập nhật thông tin giao hàng"
          open={isModalUpdateInfo}
          onCancel={handleCancelUpdate}
          onOk={handleUpdateUserInfo}
        >
          <Loading isPending={isPending}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponent
                  value={stateUserDetails?.name}
                  onChange={handleInputChangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails?.email}
                  onChange={handleInputChangeDetails}
                  name="email"
                  readOnly
                  disabled
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your phone!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails?.phone}
                  onChange={handleInputChangeDetails}
                  name="phone"
                />
              </Form.Item>
              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your address!" },
                ]}
              >
                <InputComponent
                  value={stateUserDetails?.address}
                  onChange={handleInputChangeDetails}
                  name="address"
                />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <InputComponent
                  value={stateUserDetails?.city}
                  onChange={handleInputChangeDetails}
                  name="city"
                />
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent>
      </Loading>
    </div>
  );
};

export default Payment;
