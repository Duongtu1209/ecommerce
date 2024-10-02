import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Input, message, Space } from 'antd'
import { PlusCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../Table/Table'
import InputComponent from '../Input/Input'
import { getBase64 } from '../../services/utils'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import Loading from '../Loading/Loading'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../Drawer/Drawer'
import { useSelector } from "react-redux";
import { ModalComponent } from '../Modal/Modal'
import { SearchOutlined } from '@ant-design/icons';

export const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowSelected, setRowSelected] = useState('');
    const [isOpenDrawer, setIsDrawerOpen] = useState(false);
    const [isPendingUpdate, setIsPendingUpdate] = useState(false);
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const user = useSelector((state) => state?.user)
    const searchInput = useRef(null);
    const [stateProduct, setStateProduct] = useState({
        sku: '',
        name: '',
        price: '',
        description: '',
        rating: '',
        quantity: '',
        image: '',
        type: ''
    });

    const [stateProductDetails, setStateProductDetails] = useState({
        sku: '',
        name: '',
        price: '',
        description: '',
        rating: '',
        quantity: '',
        image: '',
        type: ''
    });

    const [form] = Form.useForm();

    const mutation = useMutationHook(
        (data) => ProductService.createProduct(data)
    );

    const mutationUpdate = useMutationHook(
        (data) => {            
            const {id, token, ...rests} = data            
            const res = ProductService.updateProduct(id, token, {...rests})
            return res
        }
    );

    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct();
        return res;
    };

    const mutationDelete = useMutationHook(
        (data) => {            
            const {id, token} = data            
            const res = ProductService.deleteProduct(id, token)
            return res
        }
    );

    const { data, isPending, isSuccess, isError } = mutation;
    const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate;
    const { data: dataDeleted, isPending: isPendingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete;


    const queryProduct = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
        retry: 3,
        retryDelay: 1000,
    });
    const { isPending: isPendingProducts, data: products } = queryProduct

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success('Product created successfully');
            handleCancel();
        } else if (isError) {
            message.error('Error occurred while creating product');
            handleCancel();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);

    useEffect(() => {
        if (isSuccessUpdated && dataUpdated?.status === 'OK') {
            message.success('Product updated successfully');
            handleCancelDrawer();
        } else if (isErrorUpdated) {
            message.error('Error occurred while updating product');
            handleCancelDrawer();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessUpdated, isErrorUpdated]);

    useEffect(() => {
        if (isSuccessDeleted && dataDeleted?.status === 'OK') {
            message.success('Delete product successfully');
            handleCancelDelete();
        } else if (isErrorDeleted) {
            message.error('Error occurred while delete product');
            handleCancelDelete();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccessDeleted, isErrorDeleted]);

    const fetchDetailsProduct = async (id) => {
        try {
            const res = await ProductService.getDetailsProduct(id);
            if (res?.data) {
                setStateProductDetails({
                    sku: res?.data?.sku,
                    name: res?.data?.name,
                    price: res?.data?.price,
                    description: res?.data?.description,
                    rating: res?.data?.rating,
                    quantity: res?.data?.quantity,
                    image: res?.data?.image,
                    type: res?.data?.type
                });
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            message.error('Failed to fetch product details');
        }
        setIsPendingUpdate(false);
    };

    useEffect(() => {
        form.setFieldsValue(stateProductDetails);
    }, [form, stateProductDetails]);

    useEffect(() => {
        if (rowSelected) {
            setIsPendingUpdate(true)
            fetchDetailsProduct(rowSelected);
        }
    }, [rowSelected]);

    const handleDetailsProduct = () => {
        setIsDrawerOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setStateProduct({
            sku: '',
            name: '',
            price: '',
            description: '',
            rating: '',
            quantity: '',
            image: '',
            type: ''
        });
    };

    const handleCancelDrawer = () => {
        setIsDrawerOpen(false);
        form.resetFields();
    };

    const onFinish = () => {
        mutation.mutate(stateProduct, {
            onSettled: () => {
                queryProduct.refetch()
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStateProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChangeDetails = (e) => {
        const { name, value } = e.target;
        setStateProductDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleUploadImage = async (info) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
            const base64 = await getBase64(file);
            setStateProduct({
                ...stateProduct,
                image: base64
            });
        } else {
            message.error('No file uploaded or file is not valid');
        }
    };

    const handleUploadImageDetails = async (info) => {
        const file = info.fileList[0]?.originFileObj;
        if (file) {
            const base64 = await getBase64(file);
            setStateProductDetails({
                ...stateProductDetails,
                image: base64
            });
        } else {
            console.error("No file uploaded or undefined");
        }
    };
   
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: 25, cursor: "pointer" }} onClick={() => setIsModalOpenDelete(true)}/>
                <EditOutlined  style={{ color: 'orange', fontSize: 25, cursor: "pointer" }} onClick={handleDetailsProduct}/>
            </div>
        )
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
      };
      const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters();
        confirm();
      };
      const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div
            style={{
              padding: 8,
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Input
              ref={searchInput}
              placeholder={`Search ${dataIndex}`}
              value={`${selectedKeys[0] || ''}`}
              onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
              onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
              style={{
                marginBottom: 8,
                display: 'block',
              }}
            />
            <Space>
              <Button
                type="primary"
                onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                icon={<SearchOutlined />}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => clearFilters && handleReset(clearFilters, confirm ,dataIndex)}
                size="small"
                style={{
                  width: 90,
                }}
              >
                Reset
              </Button>
            </Space>
          </div>
        ),
        filterIcon: (filtered) => (
          <SearchOutlined
            style={{
              color: filtered ? '#1890ff' : undefined,
            }}
          />
        ),
        onFilter: (value, record) =>
          record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => searchInput.current?.select(), 100);
          }
        }
      });

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: (a, b)=> a.name.length - b.name.length,
          ...getColumnSearchProps('name')
        },
        {
          title: 'Type',
          dataIndex: 'type',
          ...getColumnSearchProps('type'),
          
        },
        {
          title: 'Sku',
          dataIndex: 'sku',
          sorter: (a, b)=> a.sku.length - b.sku.length
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
        },
        {
          title: 'Price',
          dataIndex: 'price',
          sorter: (a, b)=> a.price.length - b.price.length
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
          sorter: (a, b)=> a.rating.length - b.rating.length
        },
        {
          title: 'Discount',
          dataIndex: 'discount',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          render: renderAction
        }
      ];

    const dataTable = products?.data?.length && products?.data?.map((product) => {
    return {...product, key: product._id}
    })    

    const onUpdateProduct = () => {
        mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    
    const handleDeleteProduct = () => {
        mutationDelete.mutate({id: rowSelected, token: user?.access_token}, {
            onSettled: () => {
                queryProduct.refetch()
            }
        })
    }

    return (
        <div>
            <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
            <div style={{ marginTop: 20}}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusCircleFilled style={{ fontSize: '40px'}}/></Button>
            </div>
            <div style={{ marginTop: 20}}>
                <TableComponent columns={columns} data={dataTable} isPending={isPendingProducts} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record._id)
                        }, 
                    };
                }}/>
            </div>
            <ModalComponent title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
                <Loading isPending={isPending}>
                    <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onFinish}
                    autoComplete="off"
                    form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProduct.name} onChange={handleInputChange} name='name'/>
                        </Form.Item>
                        <Form.Item
                            label="Sku"
                            name="sku"
                            rules={[{ required: true, message: 'Please input your Sku!' }]}
                        >
                            <InputComponent value={stateProduct.sku} onChange={handleInputChange} name='sku'/>
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProduct.type} onChange={handleInputChange} name='type'/>
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please input your count in stock!' }]}
                        >
                            <InputComponent value={stateProduct.quantity} onChange={handleInputChange} name='quantity'/>
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProduct.price} onChange={handleInputChange} name='price'/>
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <InputComponent value={stateProduct.description} onChange={handleInputChange} name='description'/>
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                        >
                            <InputComponent value={stateProduct.rating} onChange={handleInputChange} name='rating'/>
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                        >   
                            <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                                <Button>Select image</Button>
                            </WrapperUploadFile>
                            { stateProduct.image && (
                                <img src={stateProduct.image} style={{
                                    height: '60px',
                                    width:'60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: 10
                                }} alt='avatar'/>
                            )}
                        </Form.Item>
                        

                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                            Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </ModalComponent>
            <DrawerComponent width='86%' title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsDrawerOpen(false)}>
            <Loading isPending={isPendingUpdate}>
                <Form
                    name="basic"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 22 }}
                    onFinish={onUpdateProduct}
                    autoComplete="off"
                    form={form}
                    >
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <InputComponent value={stateProductDetails.name} onChange={handleInputChangeDetails} name='name'/>
                        </Form.Item>
                        <Form.Item
                            label="Sku"
                            name="sku"stateProductDetails
                            rules={[{ required: true, message: 'Please input your Sku!' }]}
                        >
                            <InputComponent value={stateProductDetails.sku} onChange={handleInputChangeDetails} name='sku'/>
                        </Form.Item>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input your type!' }]}
                        >
                            <InputComponent value={stateProductDetails.type} onChange={handleInputChangeDetails} name='type'/>
                        </Form.Item>

                        <Form.Item
                            label="Quantity"
                            name="quantity"
                            rules={[{ required: true, message: 'Please input your count in stock!' }]}
                        >
                            <InputComponent value={stateProductDetails.quantity} onChange={handleInputChangeDetails} name='quantity'/>
                        </Form.Item>

                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please input your price!' }]}
                        >
                            <InputComponent value={stateProductDetails.price} onChange={handleInputChangeDetails} name='price'/>
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                        >
                            <InputComponent value={stateProductDetails.description} onChange={handleInputChangeDetails} name='description'/>
                        </Form.Item>

                        <Form.Item
                            label="Rating"
                            name="rating"
                        >
                            <InputComponent value={stateProductDetails.rating} onChange={handleInputChangeDetails} name='rating'/>
                        </Form.Item>
                        <Form.Item
                            label="Image"
                            name="image"
                        >   
                            <WrapperUploadFile onChange={handleUploadImageDetails} maxCount={1}>
                                <Button>Select image</Button>
                            </WrapperUploadFile>
                            { stateProductDetails.image && (
                                <img src={stateProductDetails.image} style={{
                                    height: '60px',
                                    width:'60px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginLeft: 10
                                }} alt='avatar'/>
                            )}
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                Apply
                            </Button>
                        </Form.Item>
                    </Form>
                </Loading>
            </DrawerComponent>
            <ModalComponent title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct}>
             <Loading isPending={isPendingDeleted}>
                <div>Bạn chắc chắn muốn xóa sản phẩm này ?</div>
             </Loading>
            </ModalComponent>
        </div>
    )
}
