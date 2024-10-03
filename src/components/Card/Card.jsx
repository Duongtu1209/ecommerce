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

const CardComponent = (props) => {
  const {quantity, description, image, name, price, rating, discount, selled, type, id} = props
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-detail/${id}`)
  }
  return (
    <WrapperCardStyle
      hoverable
      style={{ width: 255, }}
      cover={
        <img
          alt="example"
          src={ image }
          height={200}
          style={{ objectFit:'contain'}}
        />
      }
      onClick={() => handleDetailsProduct(id)}
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
        <WrapperStyleTextSell>| Da ban {selled || 1000}+</WrapperStyleTextSell>
      </WrapperReportText>
      <WrapperPriceText>
        <span style={{ marginRight: '8px'}}>{price?.toLocaleString()}</span>
        <WrapperDiscountText>{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
