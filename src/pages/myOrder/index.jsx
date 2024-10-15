import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import * as OrderService from "../../services/OrderService";
import Loading from "../../components/Loading/Loading";
import {
  WrapperContainer,
  WrapperInfo,
  WrapperItemOrder,
  WrapperListOrder,
  WrapperStyleHeader,
} from "./style";
import { useLocation, useNavigate } from "react-router-dom";
import { convertPrice } from "../../services/utils";
import ButtonComponent from "../../components/Button/Button";
import { useMutationHook } from "../../hooks/useMutationHook";
import { message } from "antd";
import {ModalComponent} from "../../components/Modal/Modal";

const MyOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
  const { state } = location;
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUser(state.token, state.id);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders", state.id],
    queryFn: fetchMyOrder,
    enabled: !!state?.token && !!state?.id,
  });

  const { isLoading, data, error } = queryOrder;

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };

    const mutation = useMutationHook((data) => {
        const { id, token } = data;
        return OrderService.cancelOrder(token, id);
    });

    const showCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setIsModalVisible(true);
    };

    const handleConfirmCancelOrder = () => {
        mutation.mutate(
            { id: selectedOrderId, token: state?.token },
            {
                onSuccess: () => {
                    queryOrder.refetch();
                    message.success("Đơn hàng đã được hủy thành công.");
                },
                onError: () => {
                    message.error("Không thể hủy đơn hàng. Vui lòng thử lại.");
                },
                onSettled: () => {
                    queryOrder.refetch();
                },
            }
        );
        setIsModalVisible(false);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

  const { isLoading: isLoadingCancel } = mutation;

  if (error) {
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
          <div
              style={{
                  height: "100%",
                  width: "1600px",
                  margin: "0 auto",
                  paddingBottom: 120,
              }}
          >
              <h4>Bạn chưa có đơn hàng nào</h4>
          </div>
      </div>
    );
  }

    return (
    <Loading isPending={isLoading}>
      <div
        style={{
          paddingTop: 10,
          background: "#f5f5fa",
          width: "100%",
          minHeight: "100vh",
          height: "100%",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "1600px",
            margin: "0 auto",
            paddingBottom: 120,
          }}
        >
          <h4>Đơn hàng của tôi</h4>
          {data?.map((order) => {
            return (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <WrapperContainer>
                  <WrapperInfo style={{ marginTop: 30 }}>
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                        Trạng thái
                      </span>
                      <div>
                        <span
                          style={{
                            color: "rgb(255, 66, 78)",
                          }}
                        >
                          Giao hàng:{" "}
                        </span>
                        {`${
                          order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
                        }`}
                      </div>
                      <div>
                        <span
                          style={{
                            color: "rgb(255, 66, 78)",
                          }}
                        >
                          Thanh toán:{" "}
                        </span>
                        {`${
                          order.isDelivered
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"
                        }`}
                      </div>
                    </div>
                    <WrapperStyleHeader>
                      <span style={{ display: "inline-block", width: 500 }}>
                        <span> Sản phẩm</span>
                      </span>
                      <div
                        style={{
                          display: "flex",
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Đơn giá</span>
                        <span>Số lượng</span>
                        <span>Thành tiền</span>
                      </div>
                    </WrapperStyleHeader>
                    <WrapperListOrder style={{ marginTop: 0 }}>
                      {order?.orderItems?.map((item) => {
                        return (
                          <WrapperItemOrder>
                            <div
                              style={{
                                width: 500,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                              }}
                            >
                              <a href={`/product-detail/${item?.product}`}>
                                <img
                                  src={item?.image}
                                  style={{
                                    width: 77,
                                    height: 79,
                                    objectFit: "cover",
                                  }}
                                  alt={item?.image?.alt}
                                />
                              </a>

                              <div
                                style={{
                                  marginRight: 20,
                                  width: "calc(100% - 100px)",
                                }}
                              >
                                {item?.name}
                              </div>
                            </div>
                            <div
                              style={{
                                flex: 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {item?.discount > 0 ? (
                                  <>
                                    <span
                                      style={{ fontSize: 15, color: "#252525" }}
                                    >
                                      {convertPrice(
                                        item?.price * (1 - item?.discount / 100)
                                      )}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 15,
                                        color: "#252525",
                                        textDecoration: "line-through",
                                      }}
                                    >
                                      {convertPrice(item?.price)}
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    style={{ fontSize: 15, color: "#252525" }}
                                  >
                                    {convertPrice(item?.price)}
                                  </span>
                                )}
                              </span>
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{ fontSize: 15, color: "#252525" }}
                                >
                                  {item?.quantity}
                                </span>
                              </span>
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                {item?.discount > 0 ? (
                                  <>
                                    <span
                                      style={{
                                        fontSize: 15,
                                        color: "rgb(255, 66, 78)",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {convertPrice(
                                        item?.price *
                                          item?.quantity *
                                          (1 - item?.discount / 100)
                                      )}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: 15,
                                        color: "rgb(255, 66, 78)",
                                        fontWeight: 500,
                                        textDecoration: "line-through",
                                      }}
                                    >
                                      {convertPrice(
                                        item?.price * item?.quantity
                                      )}
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    style={{
                                      fontSize: 15,
                                      color: "rgb(255, 66, 78)",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {convertPrice(item?.price * item?.quantity)}
                                  </span>
                                )}
                              </span>
                            </div>
                          </WrapperItemOrder>
                        );
                      })}
                    </WrapperListOrder>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                        }}
                      >
                        Tổng tiền
                      </span>
                      <span
                        style={{
                          fontSize: 30,
                          color: "rgb(255, 66, 78)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.grandTotal)}
                      </span>
                    </div>
                  </WrapperInfo>
                  <WrapperInfo>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 20,
                      }}
                    >
                      {!order?.isDelivered && (
                        <ButtonComponent
                          onClick={() => showCancelModal(order?._id)}
                          size={40}
                          styleButton={{
                            height: "36px",
                            border: "1px solid rgb(11, 116, 229)",
                            borderRadius: 4,
                          }}
                          textbutton={
                            isLoadingCancel ? "Đang hủy..." : "Hủy đơn hàng"
                          }
                          styleTextButton={{
                            color: "rgb(11, 116, 229)",
                            fontSize: 14,
                          }}
                          disabled={isLoadingCancel}
                        />
                      )}

                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid rgb(11, 116, 229)",
                          borderRadius: 4,
                        }}
                        textbutton={"Xem chi tiết"}
                        styleTextButton={{
                          color: "rgb(11, 116, 229)",
                          fontSize: 14,
                        }}
                      ></ButtonComponent>
                    </div>
                  </WrapperInfo>
                </WrapperContainer>
              </div>
            );
          })}
        </div>
          <ModalComponent
              title="Hủy đơn hàng"
              open={isModalVisible}
              onCancel={handleCancelModal}
              onOk={handleConfirmCancelOrder}
          >
              <div>Bạn chắc chắn muốn hủy đơn hàng này ?</div>
          </ModalComponent>
      </div>
    </Loading>
  );
};

export default MyOrder;
