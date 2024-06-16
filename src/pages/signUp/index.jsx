import React from "react";
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputFormComponent from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/Button/Button";
import { Image } from "antd";
import logoLogin from "../../assets/images/logo-login.png";
import { useState } from "react";

const SignUp = () => {
  const { isShowPassword, setIsShowPassword } = useState(false);
  const { isShowConfirmPassword, setIsShowConfirmPassword } = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: 800,
          display: "flex",
          height: 445,
          borderRadius: 6,
          background: "#fff",
        }}
      >
        <WrapperContainerLeft>
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{ margin: "0px 0px 10px", fontSize: 24, fontWeight: 700 }}
            >
              {"Xin chào,"}
            </h1>
            <span style={{ fontSize: 15, margin: 0 }}>
              {"Đăng nhập hoặc Tạo tài khoản "}
            </span>
          </div>

          <div className="input">
            <InputFormComponent placeholder="acb@email.com" />
          </div>
          <div className="input">
            <InputFormComponent
              placeholder="Mật khẩu"
              type={isShowPassword ? "text" : "password"}
            />
            <span className="show-pass">{isShowPassword ? "Ẩn" : "Hiện"}</span>
          </div>
          <div className="input">
            <InputFormComponent
              placeholder="Nhập lại mật khẩu"
              type={isShowConfirmPassword ? "text" : "password"}
            />
            <span className="show-pass">
              {isShowConfirmPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>

          <ButtonComponent
            bordered={false}
            size={40}
            styleButton={{
              background: "rgb(255, 66, 78)",
              height: "48px",
              width: "100%",
              border: "none",
              borderRadius: "4px",
              margin: "26px 0 10px",
            }}
            styleTextButton={{ color: "#fff", fontSize: "16px" }}
            textbutton={"Đăng nhập"}
          />
          <p class="already-account">
            Bạn đã có tài khoản ? <span> Đăng nhập</span>
          </p>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            width={203}
            height={203}
            src={logoLogin}
            preview={false}
            alt="logo-login"
          />
          <div className="content">
            <h4>{"Mua sắm tại TP"}</h4>
            <span>{"Siêu ưu đãi mỗi ngày"}</span>
          </div>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUp;
