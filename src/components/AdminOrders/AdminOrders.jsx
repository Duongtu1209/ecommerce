import React from "react";
import { WrapperHeader,  } from "./style";
import TableComponent from "../Table/Table";

import { useQuery } from "@tanstack/react-query";
import {useSelector} from "react-redux";
import * as OrderService from "../../services/OrderService";
import {convertPrice} from "../../services/utils";

export const AdminOrders = () => {
  const user = useSelector((state) => state?.user)
    const getAllOrders = async () => {
        const res = await OrderService.getAll(user?.access_token);
        return res;
    };
  const queryOrders = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    retry: 3,
    retryDelay: 1000,
  });
  const { isPending: isPendingOrders, data: orders } = queryOrders;

  const columns = [
    {
      title: "Người mua",
      dataIndex: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
      {
          title: "Phương thức thanh toán",
          dataIndex: "paymentMethod",
      },
    {
      title: "Trạng thái",
      dataIndex: "isDelivered",
    },
      {
          title: "Thanh toán",
          dataIndex: "isPaid",
      },

      {
          title: "Giảm giá",
          dataIndex: "discountAmount",
          render: (price) => convertPrice(price)
      },
      {
          title: "Tổng tiền",
          dataIndex: "grandTotal",
          render: (price) => convertPrice(price)
      },

  ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return {
                ...order,
                key: order._id,
                userName: order?.user?.name,
                email: order?.user?.email,
                isPaid: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
                isDelivered: order?.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"
            };
        });

  return (
    <div>
      <WrapperHeader>Quản lí dơn hàng</WrapperHeader>
      <div style={{ marginTop: 20 }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          isPending={isPendingOrders}
        />
      </div>
    </div>
  );
};
