import { Badge, Col } from 'antd'
import React from 'react'
import {WrapperHeader, WrapperHeaderAccout, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import Search from '../Button/Search';

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  return (
    <div style={{  heiht: '100%', width: '100%', display: 'flex',background: '#9255FD', justifyContent: 'center' }}>
      <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset' }}>
        <Col span={5}>
          <WrapperTextHeader to='/'>{'E-Commerce PT'}</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <Search
              size="large"
              textbutton="Tìm kiếm"
              placeholder="input search text"
              backgroundColorButton="#5a20c1"
            />
          </Col>
        )}
        <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
            <WrapperHeaderAccout>
                <UserOutlined style={{ fontSize: '30px' }} />
                <div style={{ cursor: 'pointer' }}>
                  <WrapperTextHeaderSmall>Đăng nhập/Đăng ký</WrapperTextHeaderSmall>
                  <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                  </div>
                </div>
            </WrapperHeaderAccout>
          {!isHiddenCart && (
            <div style={{cursor: 'pointer'}}>
              <Badge size="small">
                <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }} />
              </Badge>
            </div>
          )}
        </Col>
      </WrapperHeader>
    </div>
  )
}

export default Header