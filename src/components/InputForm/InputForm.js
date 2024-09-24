import React from "react";
import { WrapperInputStyle } from "./style";

const InputFormComponent = ({
  size,
  placeholder = "Nhap text",
  bordered,
  style,
  value,
  handleOnChange,
  ...rests
}) => {
  const handleOnChangeInput = (e) => {
    handleOnChange(e.target.value);
  };
  return (
    <WrapperInputStyle
      size={size}
      placeholder={placeholder}
      style={style}
      {...rests}
      value={value}
      onChange={handleOnChangeInput}
    />
  );
};

export default InputFormComponent;
