import React from "react";
import { useState } from "react";
import { WrapperInputStyle } from "./style";

const InputFormComponent = ({
  size,
  placeholder = "Nhap text",
  bordered,
  style,
  ...rests
}) => {
  const { value, setValue } = useState("");
  return (
    <WrapperInputStyle
      size={size}
      placeholder={placeholder}
      style={style}
      {...rests}
      value={value}
    />
  );
};

export default InputFormComponent;
