import React from 'react'
import { WrapperHeader } from './style'
import { Button } from 'antd'
import { PlusCircleFilled } from '@ant-design/icons'
import TableComponent from '../Table/Table'

export const AdminUser = () => {
  return (
    <div>
        <WrapperHeader>Quản lí người dùng</WrapperHeader>
        <div style={{ marginTop: 20}}>
            <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}}><PlusCircleFilled style={{ fontSize: '40px'}}/></Button>
        </div>
        <div style={{ marginTop: 20}}>
            <TableComponent/>
        </div>
    </div>
  )
}
