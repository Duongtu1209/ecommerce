import { Checkbox } from "antd";
import React from "react";

const Order = ({count = 1}) => {
    const onChange = () => {}
    const handleChangeCount = () => {}
    const handleOnChangeCheckAll = () => {

    }
    return (
      <div
        style={{
          paddingTop: 10,
          background: "f5f5fa",
          width: "100%",
          minHeight: "100vh",
          height: "100%",
        }}
      >
        {/* <div style={{ height: "100%", width: "1600", margin: "0 auto" }}>
          <h3>Gio hang</h3>
          <div style={{ display: "flex", justifyContent: "content" }}>
            <WrapperLeft>
              <WrapperStyleHeader>
                <span style={{ display: "inline-block", width: 390 }}>
                  <Checkbox onChange={handleOnChangeCheckAll}></Checkbox>
                  <span> Tat ca ({count} san pham)</span>
                </span>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "start",
                  }}
                >
                  <span>Don gia</span>
                  <span>So Luong</span>
                  <span>Thanh tien</span>
                  <DeleteOutlined style={{cursor: 'pointer'}}/>
                </div>
              </WrapperStyleHeader>
            </WrapperLeft>
          </div>
        </div> */}
      </div>
    );
}

export default Order;