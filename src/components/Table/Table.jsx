import { Table } from 'antd';
import React, { useMemo, useState } from 'react'
import Loading from '../Loading/Loading';
import { Excel } from "antd-table-saveas-excel"
const TableComponent = (props) => {
  const {selectionType = 'checkbox', data = [], isPending = false, columns = [], handleDeleteMany} = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(() => {
    const filter = columns?.filter((col) => col.dataIndex !== 'action' )
    return filter
  },[columns])
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {      
      setRowSelectedKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };
  

  const handleDeleteAll =() => {
    handleDeleteMany(rowSelectedKeys)
  }

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(data, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx")
  }

  return (
      <Loading isPending={isPending}>
        <div style={{ position: 'relative',
            display:'flex',
            marginBottom: 12}}>
            <div style={{ 
              fontWeight: 'bold',
              padding:'10px',
              cursor: 'pointer',
              borderRadius: 100,
              border: '1px solid #252525',
              textAlign: 'center',
              marginRight: 10
              }}
              onClick={exportExcel}>Xuất file excel
                
            </div>
          {rowSelectedKeys.length > 0 && (
            <div style={{ 
              color: '#fff', 
              background:'#252525',
              fontWeight: 'bold',
              padding:'10px',
              cursor: 'pointer',
              maxWidth: 80,
              borderRadius: 100,
              textAlign: 'center',
              
              }}
              onClick={handleDeleteAll}
              >
            Xóa tất cả
          </div>
          )}
          
        </div>
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
          {...props}
        />
      </Loading>
  )
}

export default TableComponent