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

const CardComponent = (props) => {
  const {quantity, description, image, name, price, rating, discount, selled, type} = props
  return (
    <WrapperCardStyle
      cover={
        <img
          alt="example"
          src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
        />
      }
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
        <span style={{ marginRight: '8px'}}>{price}</span>
        <WrapperDiscountText>{discount || 5}%</WrapperDiscountText>
      </WrapperPriceText>
    </WrapperCardStyle>
  );
};

export default CardComponent;
