import styled from "styled-components";

export const WrapperContainerLeft = styled.div`
  flex: 1;
  padding: 40px 45px 24px;
  display: flex;
  flex-direction: column;

  .forgot-pass {
    color: rgb(13, 92, 182);
    margin: 20px 0px 0px;
    cursor: pointer;
    font-size: 13px;
    display: inline-block;
  }

  .create-account span {
    color: rgb(13, 92, 182);
    display: inline-block;
    margin-left: 5px;
    cursor: pointer;
  }

  .create-account {
    color: rgb(120, 120, 120);
    font-size: 13px;
    margin: 10px 0px 0px;
  }

  .input {
    position: relative;
    z-index: 1;
    margin-bottom: 15px;
  }

  .input .show-pass {
    position: absolute;
    right: 0px;
    top: 10px;
    z-index: 2;
    color: rgb(13, 92, 182);
    font-size: 14px;
    display: inline-block;
    cursor: pointer;
  }
`;

export const WrapperContainerRight = styled.div`
  background: linear-gradient(
    136deg,
    rgb(240, 248, 255) -1%,
    rgb(219, 238, 255) 85%
  );
  gap: 4px;
  width: 300px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  border-radius: 0px 20px 20px 0px;
  .content {
    margin: 30px 0px 0px;
    text-align: center;
  }
  .content span {
    font-size: 13px;
    color: rgb(11, 116, 229);
    font-weight: 500;
  }
  .content h4 {
    color: rgb(11, 116, 229);
    font-weight: 500;
    margin: 0 0 5px;
    font-size: 17px;
  }
`;

export const WrapperTextLight = styled.span`
  color: rgb(13, 92, 182);
  font-size: 13px;
`;
