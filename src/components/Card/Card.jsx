import React from 'react';
import { StarFilled } from "@ant-design/icons"
import { StyleNameProduct, WrapperCardStyle, WrapperDiscountText, WrapperPriceText, WrapperReportText } from './style';
import official from "../../assets/images/official.png"

const CardComponent = () => {
    return (
        <WrapperCardStyle
          hoverable
          cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
        >
            <img
                src={official}
                style={{width: 68, height: 14, position: 'absolute', top: 0, left: 0, borderTopLeftRadius: 3}}
                alt='official'
              />
            <StyleNameProduct>Iphone</StyleNameProduct>
            <WrapperReportText>
                <span style={{marginRight: 4}}>
                    <span>4.96</span>
                    <StarFilled style={{fontSize: 12, color: 'yellow'}}/>
                </span>
                <span>| Da ban 1000+</span>
            </WrapperReportText>
            <WrapperPriceText>
                1.000.000d
                <WrapperDiscountText>
                    -5%
                </WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
      );
}

export default CardComponent;