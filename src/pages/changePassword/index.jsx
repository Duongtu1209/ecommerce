import React, {useState} from "react";
import {WrapperContentProfile, WrapperHeader, WrapperInput, WrapperLabel,} from "./style";
import InputFormComponent from "../../components/InputForm/InputForm";
import ButtonComponent from "../../components/Button/Button";
import {message} from "antd";
import {useMutationHook} from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {resetUser} from "../../redux/sliders/userSlider";

const ChangePassword = () => {
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShowOldPassword, setIsShowOldPassword] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const mutation = useMutationHook((data) => {
    const { id, token, ...rests } = data;
      return UserService.changePassword(id, token, {...rests});
  });

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            message.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
            return;
        }

        if (!oldPassword || !password) {
            message.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (oldPassword === password) {
            message.error("Mật khẩu mới không được trùng với mật khẩu cũ");
            return;
        }

        const params = {
            oldPassword: oldPassword,
            newPassword: password,
            confirmPassword: confirmPassword
        };

        mutation.mutate(
            { id: user?._id, token: user?.access_token, ...params },
            {
                onSuccess: async (data) => {
                    if (data.status === "ERR") {
                        message.error(data.message || "Đã xảy ra lỗi. Vui lòng thử lại.");
                        return;
                    }

                    message.success(data.message || "Đổi mật khẩu thành công!");
                    await UserService.logoutUser();
                    localStorage.clear("access_token");
                    dispatch(resetUser());
                    navigate("/sign-in");
                },
                onError: (error) => {
                    message.error(
                        error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại."
                    );
                },
            }
        );
    };

  return (
      <div style={{ width: "1600px", margin: "0 auto" }}>
        <WrapperHeader>Đổi mật khẩu</WrapperHeader>
        <WrapperContentProfile>
          <WrapperInput style={{ position: "relative" }}>
            <WrapperLabel htmlFor="old-password">Mật khẩu cũ</WrapperLabel>
            <InputFormComponent
                placeholder="Mật khẩu cũ"
                value={oldPassword}
                type={isShowOldPassword ? "text" : "password"}
                handleOnChange={setOldPassword}
            />
            <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 10,
                  zIndex: 2,
                  color: "rgb(13, 92, 182)",
                  fontSize: 14,
                  display: "inline-block",
                  cursor: "pointer",
                }}
                className="show-pass"
                onClick={() => setIsShowOldPassword(!isShowOldPassword)}
            >
            {isShowOldPassword ? "Ẩn" : "Hiện"}
          </span>
          </WrapperInput>
          <WrapperInput style={{ position: "relative" }}>
            <WrapperLabel htmlFor="new-password">Mật khẩu mới</WrapperLabel>
            <InputFormComponent
                placeholder="Mật khẩu mới"
                value={password}
                type={isShowPassword ? "text" : "password"}
                handleOnChange={setPassword}
            />
            <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 10,
                  zIndex: 2,
                  color: "rgb(13, 92, 182)",
                  fontSize: 14,
                  display: "inline-block",
                  cursor: "pointer",
                }}
                className="show-pass"
                onClick={() => setIsShowPassword(!isShowPassword)}
            >
            {isShowPassword ? "Ẩn" : "Hiện"}
          </span>
          </WrapperInput>
          <WrapperInput style={{ position: "relative" }}>
            <WrapperLabel htmlFor="confirm-password">Nhập lại mật khẩu mới</WrapperLabel>
            <InputFormComponent
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                type={isShowConfirmPassword ? "text" : "password"}
                handleOnChange={setConfirmPassword}
            />
            <span
                style={{
                  position: "absolute",
                  right: 0,
                  top: 10,
                  zIndex: 2,
                  color: "rgb(13, 92, 182)",
                  fontSize: 14,
                  display: "inline-block",
                  cursor: "pointer",
                }}
                className="show-pass"
                onClick={() => setIsShowConfirmPassword(!isShowConfirmPassword)}
            >
            {isShowConfirmPassword ? "Ẩn" : "Hiện"}
          </span>
          </WrapperInput>
          <ButtonComponent
              size={40}
              styleButton={{
                height: "30px",
                width: "fit-content",
                borderRadius: "4px",
                padding: "2px 6px 6px",
                position: "relative",
                left: "50%",
                transform: "translate(-50%, 0)",
              }}
              styleTextButton={{
                color: "rgb(26, 148, 255)",
                fontSize: "15x",
                fontWeight: 700,
              }}
              textbutton={"Đổi mật khẩu"}
              onClick={handleChangePassword}
          />
        </WrapperContentProfile>
      </div>
  );
};

export default ChangePassword;
