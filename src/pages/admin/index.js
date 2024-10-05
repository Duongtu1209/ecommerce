import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import { Menu } from "antd";
import React, { useState } from "react";
import { getItem } from '../../services/utils';
import Header from '../../components/Header/Header';
import { AdminUser } from '../../components/AdminUser/AdminUser';
import { AdminProduct } from '../../components/AdminProduct/AdminProduct';

const Admin = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <AppstoreOutlined />),
      ];
    const [keySelected, setKeySelected] = useState('')
    const renderPage = (key) => {
        switch(key) {
            case 'user':
                return (
                    <AdminUser/>
                )
            case 'product':
                return (
                    <AdminProduct/>
                )
            default: 
                return <></>
        }
    }
    const handleOnClick = ({item, key, keyPath, domEvent}) => {
        setKeySelected(key)
    }
    return (
      <>
        <Header isHiddenSearch isHiddenCart />
        <div style={{ display: "flex" }}>
          <Menu
            mode="inline"
            style={{
              width: 256,
              height: "100%",
              border: 'none'
            }}
            items={items}
            onClick={handleOnClick}
          />
          <div
            style={{ flex: 1, padding: "15px", borderLeft: '1px solid #ccc', minHeight:"100vh", height:'100%' }}
          >
            {renderPage(keySelected)}
          </div>
        </div>
      </>
    );
}

export default Admin;