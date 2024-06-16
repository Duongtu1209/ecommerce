import { Input } from "antd";
import styled from "styled-components";

export const WrapperInputStyle = styled(Input)`
  border-top: none;
  border-right: none;
  border-left: none;
  border-radius: 0;
  box-shadow: none !important;
  outline: none;
  width: 100%;
  padding: 10px 0px;
  font-size: 14px;
  color: rgb(36, 36, 36);
  &:focus {
    background-color: rgb(232, 240, 254);
  }
`;
