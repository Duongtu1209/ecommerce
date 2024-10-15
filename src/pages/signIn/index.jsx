import React, { useEffect, useState } from "react";
import { WrapperContainerLeft, WrapperContainerRight } from "./style";
import InputFormComponent from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/Button/Button";
import { Image } from "antd";
import logoLogin from "../../assets/images/logo-login.png";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import Loading from "../../components/Loading/Loading";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/sliders/userSlider";

const SignIn = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const handleNavigateSignUp = () => {
    navigate("/sign-up");
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleOnChangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnChangePassword = (value) => {
    setPassword(value);
  };

  const handleSignIn = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  const mutation = useMutationHook((data) => UserService.loginUser(data));

  const { data, isPending } = mutation;
  
  useEffect(() => {
    if (data?.status === "OK") {
      if (state) {
        navigate(state);
      } else {
        navigate("/");
      }
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

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
              handleOnChange={handleOnChangePassword}
              type={isShowPassword ? "text" : "password"}
            />
            <span
              className="show-pass"
              onClick={() => setIsShowPassword(!isShowPassword)}
            >
              {isShowPassword ? "Ẩn" : "Hiện"}
            </span>
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isPending={isPending}>
            <ButtonComponent
              disabled={!email.length || !password.length}
              onClick={handleSignIn}
              size={40}
              styleButton={{
                background: "rgb(255, 66, 78)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              styleTextButton={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
              }}
              textbutton={"Đăng nhập"}
            />
          </Loading>
          <p className="create-account">
            Chưa có tài khoản?{" "}
            <span onClick={handleNavigateSignUp}>Tạo tài khoản</span>
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

export default SignIn;
