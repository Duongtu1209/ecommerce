import React, { useEffect } from "react";
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputFormComponent from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/Button/Button";
import { Form, Image } from "antd";
import logoLogin from "../../assets/images/logo-login.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import * as message from "../../components/Message/Message";

const SignUp = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };
  const handleOnChangeConfirmPassword = (value) => {
    setConfirmPassword(value);
  };

  const mutation = useMutationHook((data) => UserService.signUpUser(data));

  const { data, isPending, isError } = mutation;

  useEffect(() => {
    if (data?.status === "OK") {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error(data?.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status]);

  const handleSignUp = () => {
    mutation.mutate({
      email,
      password,
      confirmPassword,
    });
  };

  return (
    <Form
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
            <InputFormComponent
              placeholder="acb@email.com"
              value={email}
              handleOnChange={handleOnChangeEmail}
            />
          </div>
          <div className="input">
            <InputFormComponent
              placeholder="Mật khẩu"
              value={password}
              type={isShowPassword ? "text" : "password"}
              handleOnChange={handleOnChangePassword}
            />
            <span
              className="show-pass"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>
          <div className="input">
            <InputFormComponent
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              type={isShowConfirmPassword ? "text" : "password"}
              handleOnChange={handleOnChangeConfirmPassword}
            />
            <span
              className="show-pass"
              onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
              {isShowConfirmPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={
                !email.length || !password.length || !confirmPassword.length
              }
              onClick={handleSignUp}
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
              textbutton={"Đăng Ký"}
            />
          </Loading>
          <p className="already-account">
            Bạn đã có tài khoản ?{" "}
            <span onClick={handleNavigateSignIn}> Đăng nhập</span>
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
    </Form>
  );
};

export default SignUp;
