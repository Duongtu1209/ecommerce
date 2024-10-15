import React from "react";
import { StarFilled } from "@ant-design/icons";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import official from "../../assets/images/official.png";
import { WrapperStyleTextSell } from "../ProductDetail/style";
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../services/utils";

const CardComponent = (props) => {
  const {
    quantity,
    description,
    image,
    name,
    price,
    rating,
    discount,
    sold,
    type,
    id,
  } = props;
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 267 }}
      cover={
        <img
          alt="example"
          src={image}
          height={200}
          style={{ objectFit: "fill" }}
        />
      }
      onClick={() => handleDetailsProduct(id)}
      disabled={quantity === 0}
    >
      <img
        src={official}
        style={{
          width: 68,
          height: 14,
          position: "absolute",
          top: 0,
          left: 0,
          borderTopLeftRadius: 3,
        }}
        alt="official"
      />
      <StyleNameProduct>{name}</StyleNameProduct>
      <WrapperReportText>
        <span style={{ marginRight: 4 }}>
          <span>{rating}</span>
          <StarFilled style={{ fontSize: 12, color: "yellow" }} />
        </span>
        <WrapperStyleTextSell>
          {sold ? `| Đã bán ${sold <= 1000 ? sold : "1000+"}` : "Chưa bán"}
        </WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: "8px" }}>{convertPrice(price)}</span>
        {discount > 0 && <WrapperDiscountText>{discount}%</WrapperDiscountText>}
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
