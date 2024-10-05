import styled from "styled-components";
import { InputNumber, Upload } from "antd";

export const WrapperHeader = styled.h1`
    color: #000;
    font-size: 14px;
`
export const WrapperUploadFile = styled(Upload)`
    .ant-upload-list.ant-upload-list-text {
        display: none
    }
`

export const WrapperInputPrice = styled(InputNumber)`
  position: relative;
  .ant-input-number-input-wrap::after {
    content: "VND";
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px 0 5px 5px;
    color: #999;
  }
  .ant-input-number-input {
    margin-left: 40px !important;
    border-left: 1px solid #ccc !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;

export const WrapperInputDiscount = styled(InputNumber)`
  position: relative;
  .ant-input-number-input-wrap::after {
    content: "%";
    position: absolute;
    top: 0;
    left: 0;
    padding: 4px 0 5px 5px;
    color: #999;
  }
  .ant-input-number-input {
    margin-left: 25px !important;
    border-left: 1px solid #ccc !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
`;