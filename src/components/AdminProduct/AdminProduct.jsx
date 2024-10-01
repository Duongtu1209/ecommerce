import React, { useEffect, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, message, Modal } from 'antd'
import { PlusCircleFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import TableComponent from '../Table/Table'
import InputComponent from '../Input/Input'
import { getBase64 } from '../../services/utils'
import { useMutationHook } from '../../hooks/useMutationHook'
import * as ProductService from '../../services/ProductService'
import Loading from '../Loading/Loading'
import { useQuery } from '@tanstack/react-query'

export const AdminProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stateProduct, setStateProduct] = useState({
        sku:'',
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
        (data) => {
            const {name, price, description, rating, image, type, quantity, sku} = data;
            const res = ProductService.createProduct({
                name, price, description, rating, quantity, image, type, sku
            })
            return res;
        }
    )
    const getAllProducts = async () => {
        const res = await ProductService.getAllProduct()
        return res;
    }
    const {data, isPending, isSuccess, isError} = mutation

    const {isPending:isPendingProducts, data: products} = useQuery({
        queryKey: ['products'],
        queryFn: getAllProducts,
        retry: 3,
        retryDelay: 1000,
      });    

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            message.success()
            handleCancel()
        } else if (isError) {
            message.error()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError])
    
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields()
    };

    const onFinish = (values) => {
        mutation.mutate(stateProduct)        
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setStateProduct((prev) => ({ ...prev, [name]: value }));
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
            console.error("No file uploaded or undefined");
        }
    }

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: 25, cursor: "pointer" }}/>
                <EditOutlined  style={{ color: 'orange', fontSize: 25, cursor: "pointer" }}/>
            </div>
        )
    }
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (text) => <a>{text}</a>
        },
        {
          title: 'Type',
          dataIndex: 'type',
        },
        {
          title: 'Sku',
          dataIndex: 'sku',
        },
        {
          title: 'Quantity',
          dataIndex: 'quantity',
        },
        {
          title: 'Price',
          dataIndex: 'price',
        },
        {
          title: 'Rating',
          dataIndex: 'rating',
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
    return (
        <div>
            <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
            <div style={{ marginTop: 20}}>
                <Button style={{ height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusCircleFilled style={{ fontSize: '40px'}}/></Button>
            </div>
            <div style={{ marginTop: 20}}>
                <TableComponent columns={columns} data={dataTable} isPending={isPendingProducts}/>
            </div>
            <Modal title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
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
            </Modal>
        </div>
    )
}
