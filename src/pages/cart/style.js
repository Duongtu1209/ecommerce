import styled from "styled-components";

export const WrapperStyleHeader = styled.div`
  background: #fff;
  padding: 9px 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  span {
    color: #252525;
    font-weight: 400;
    font-size: 13px;
  }
`;

export const WrapperLeft = styled.div`
  width: 70%;
`;

export const WrapperListOrder = styled.div``;

export const WrapperItemOrder = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 9px 16px;
  margin-top: 12px;
`;

export const WrapperPriceDiscount = styled.div`
  color: #999;
  font-size: 12px;
  text-decoration: line-through;
  margin-left: 4px;
`;

export const WrapperCountOrder = styled.div`
  display: flex;
  align-items: center;
  width: 100px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export const WrapperRight = styled.div`
  width: 23%;
  margin-left: 20px;
  flex-direction: column;
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const WrapperInfo = styled.div`
  padding: 17px 20px;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
`;

export const WrapperTotal = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 17px 20px;
  background: #fff;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
`;
