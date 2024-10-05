import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperInputDiscount, WrapperInputNumber, WrapperInputPrice, WrapperUploadFile } from "./style";
import { Button, Form, Input, message, Select, Space, InputNumber } from "antd";
import {
  PlusCircleFilled,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableComponent from "../Table/Table";
import InputComponent from "../Input/Input";
import { convertPrice, getBase64, renderOptions } from "../../services/utils";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import Loading from "../Loading/Loading";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../Drawer/Drawer";
import { useSelector } from "react-redux";
import { ModalComponent } from "../Modal/Modal";

export const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsDrawerOpen] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    sku: "",
    name: "",
    price: "",
    description: "",
    rating: "",
    quantity: "",
    image: "",
    type: "",
    discount: "",
    newType: "",
  });

  const [stateProductDetails, setStateProductDetails] = useState({
    sku: "",
    name: "",
    price: "",
    description: "",
    rating: "",
    quantity: "",
    image: "",
    type: "",
    discount: "",
    newType: "",
  });

  const [createProductForm] = Form.useForm();
  const [updateProductForm] = Form.useForm();

  const mutation = useMutationHook((data) =>
    ProductService.createProduct(data)
  );

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = ProductService.updateProduct(id, token, { ...rests });
    return res;
  });

  const getAllProducts = async () => {
    const res = await ProductService.getAllOrigin();
    return res;
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = ProductService.deleteProduct(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = ProductService.deleteManyProduct(ids, token);
    return res;
  });

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDelete;
  const {
    data: dataDeletedMany,
    isPending: isPendingDeletedMany,
    isSuccess: isSuccessDeletedMany,
    isError: isErrorDeletedMany,
  } = mutationDeleteMany;

  const handleDeleteManyProducts = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          queryProduct.refetch();
        },
      }
    );
  };
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct();
    return res;
  };

  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    retry: 3,
    retryDelay: 1000,
  });
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
    retry: 3,
    retryDelay: 1000,
  });

  const { isPending: isPendingProducts, data: products } = queryProduct;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Product created successfully");
      handleCancel();
    } else if (isError) {
      message.error("Error occurred while creating product");
      handleCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Product updated successfully");
      handleCancelDrawer();
    } else if (isErrorUpdated) {
      message.error("Error occurred while updating product");
      handleCancelDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdated, isErrorUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Delete product successfully");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Error occurred while delete product");
      handleCancelDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Delete list product successfully");
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error("Error occurred while delete product");
      handleCancelDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

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
          type: res?.data?.type,
        });
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      message.error("Failed to fetch product details");
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchDetailsProduct(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    updateProductForm.setFieldsValue(stateProductDetails);
  }, [updateProductForm, stateProductDetails]);

  const handleDetailsProduct = () => {
    setIsDrawerOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    createProductForm.resetFields();
    setStateProduct({
      sku: "",
      name: "",
      price: "",
      description: "",
      rating: "",
      quantity: "",
      image: "",
      type: "",
      newType: ""
    });
  };

  const handleCancelDrawer = () => {
    setIsDrawerOpen(false);
    updateProductForm.resetFields();
  };

  const onFinish = () => {
    const params = {
      sku: stateProduct.sku,
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      quantity: stateProduct.quantity,
      image: stateProduct.image,
      discount: stateProduct.discount,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
    };
    mutation.mutate(params, {
      onSuccess: () => {
        queryProduct.refetch();
      },
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
        image: base64,
      });
    } else {
      message.error("No file uploaded or file is not valid");
    }
  };

  const handleUploadImageDetails = async (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const base64 = await getBase64(file);
      setStateProductDetails({
        ...stateProductDetails,
        image: base64,
      });
    } else {
      console.error("No file uploaded or undefined");
    }
  };

  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined
          style={{ color: "red", fontSize: 25, cursor: "pointer" }}
          onClick={() => setIsModalOpenDelete(true)}
        />
        <EditOutlined
          style={{ color: "orange", fontSize: 25, cursor: "pointer" }}
          onClick={handleDetailsProduct}
        />
      </div>
    );
  };

  const handleSearch = (confirm) => {
    confirm();
  };
  const handleReset = (clearFilters, confirm) => {
    clearFilters();
    confirm();
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={`${selectedKeys[0] || ""}`}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(confirm)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, confirm)}
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
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      width: 400,
    },
    {
      title: "Type",
      dataIndex: "type",
      ...getColumnSearchProps("type"),
    },
    {
      title: "Sku",
      dataIndex: "sku",
      sorter: (a, b) => a.sku.length - b.sku.length,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price.length - b.price.length,
      render: (price) => convertPrice(price)
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating.length - b.rating.length,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (discount) => `${discount}%`
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    products?.data?.length &&
    products?.data?.map((product) => {
      return { ...product, key: product._id };
    });

  const onUpdateProduct = () => {
    const params = {
      sku: stateProductDetails.sku,
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      rating: stateProductDetails.rating,
      quantity: stateProductDetails.quantity,
      image: stateProductDetails.image,
      discount: stateProductDetails.discount,
      type:
        stateProductDetails.type === "add_type"
          ? stateProductDetails.newType
          : stateProductDetails.type,
    };
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...params },
      {
        onSuccess: () => {
          queryProduct.refetch();
          fetchDetailsProduct(rowSelected);
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleChangeType = (value) => {
      setStateProduct({
        ...stateProduct,
        type: value,
      });
  };

  const handleChangeTypeDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };

  return (
    <div style={{ paddingBottom: 120 }}>
      <WrapperHeader>Quản lí sản phẩm</WrapperHeader>
      <div style={{ marginTop: 20 }}>
        <Button
          style={{
            height: "150px",
            width: "150px",
            borderRadius: "6px",
            borderStyle: "dashed",
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleFilled style={{ fontSize: "40px" }} />
        </Button>
      </div>
      <div style={{ marginTop: 20 }}>
        <TableComponent
          columns={columns}
          data={dataTable}
          isPending={
            isPendingProducts || isPendingDeletedMany || isPendingDeleted
          }
          handleDeleteManyProducts={handleDeleteManyProducts}
          onRow={(record, rowIndex) => {
            return {
              onClick: () => {
                setRowSelected(record._id);
              },
            };
          }}
        />
      </div>
      <ModalComponent
        forceRender
        title="Tạo sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Loading isPending={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="off"
            form={createProductForm}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProduct.name}
                onChange={handleInputChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Sku"
              name="sku"
              rules={[{ required: true, message: "Please input your Sku!" }]}
            >
              <InputComponent
                value={stateProduct.sku}
                onChange={handleInputChange}
                name="sku"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProduct.type}
                style={{
                  width: 120,
                }}
                onChange={handleChangeType}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProduct.type === "add_type" && (
              <Form.Item
                label="New Type"
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={stateProduct.newType}
                  onChange={handleInputChange}
                  name="newType"
                />
              </Form.Item>
            )}
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Please input your count in stock!",
                },
              ]}
            >
              <InputNumber
                min={0}
                value={stateProduct.quantity}
                onChange={(value) =>
                  setStateProduct((prev) => ({ ...prev, quantity: value }))
                }
                style={{ width: "100%" }}
                name="quantity"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[{ required: true, message: "Please input your price!" }]}
            >
              <WrapperInputPrice
                min={0}
                value={stateProduct.price}
                onChange={(value) =>
                  setStateProduct((prev) => ({ ...prev, price: value }))
                }
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\.\s?|(\.*)/g, "")}
                style={{ width: "100%" }}
                name="price"
              />
            </Form.Item>

            <Form.Item label="Discount" name="discount">
              <WrapperInputDiscount
                className="discount-field"
                value={stateProduct.discount}
                onChange={(value) =>
                  setStateProduct((prev) => ({ ...prev, discount: value }))
                }
                style={{ width: "100%" }}
                name="discount"
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <InputComponent
                value={stateProduct.description}
                onChange={handleInputChange}
                name="description"
              />
            </Form.Item>

            <Form.Item label="Rating" name="rating">
              <InputNumber
                min={0}
                max={5}
                step={0.1}
                value={stateProduct.rating}
                onChange={(value) =>
                  setStateProduct((prev) => ({ ...prev, discount: value }))
                }
                name="rating"
              />
            </Form.Item>
            <Form.Item label="Image" name="image">
              <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                <Button>Select image</Button>
              </WrapperUploadFile>
              {stateProduct.image && (
                <img
                  src={stateProduct.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: 10,
                  }}
                  alt="avatar"
                />
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
      <DrawerComponent
        width="86%"
        title="Chi tiết sản phẩm"
        isOpen={isOpenDrawer}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Loading isPending={isPendingUpdate}>
          <Form
            name="basic"
            labelCol={{ span: 2 }}
            wrapperCol={{ span: 22 }}
            onFinish={onUpdateProduct}
            autoComplete="off"
            form={updateProductForm}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateProductDetails.name}
                onChange={handleInputChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Sku"
              name="sku"
              stateProductDetails
              rules={[{ required: true, message: "Please input your Sku!" }]}
            >
              <InputComponent
                value={stateProductDetails.sku}
                onChange={handleInputChangeDetails}
                name="sku"
              />
            </Form.Item>
            <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: "Please input your type!" }]}
            >
              <Select
                name="type"
                value={stateProductDetails.type}
                style={{
                  width: 120,
                }}
                onChange={handleChangeTypeDetails}
                options={renderOptions(typeProduct?.data?.data)}
              />
            </Form.Item>
            {stateProductDetails.type === "add_type" && (
              <Form.Item
                label=""
                name="newType"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <InputComponent
                  value={stateProductDetails.newType}
                  onChange={handleInputChangeDetails}
                  name="newType"
                />
              </Form.Item>
            )}

            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[
                {
                  required: true,
                  message: "Please input your count in stock!",
                },
              ]}
            >
              <InputNumber
                min={0}
                value={stateProductDetails.quantity}
                onChange={(value) =>
                  setStateProductDetails((prev) => ({
                    ...prev,
                    quantity: value,
                  }))
                }
                style={{ width: "100%" }}
                name="quantity"
              />
            </Form.Item>

            <Form.Item
              label="Price"
              name="price"
              rules={[
                {
                  required: true,
                  message: "Please input your price!",
                },
              ]}
            >
              <WrapperInputPrice
                min={0}
                value={stateProductDetails.price}
                onChange={(value) =>
                  setStateProductDetails((prev) => ({
                    ...prev,
                    price: value,
                  }))
                }
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value.replace(/\.\s?|(\.*)/g, "")}
                style={{ width: "100%" }}
                name="price"
              />
            </Form.Item>
            <Form.Item label="Discount" name="discount">
              <WrapperInputDiscount
                value={stateProductDetails.discount}
                onChange={(value) =>
                  setStateProductDetails((prev) => ({
                    ...prev,
                    discount: value,
                  }))
                }
                style={{ width: "100%" }}
                className="discount-field"
                name="discount"
              />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <InputComponent
                value={stateProductDetails.description}
                onChange={handleInputChangeDetails}
                name="description"
              />
            </Form.Item>

            <Form.Item label="Rating" name="rating">
              <InputNumber
                min={0}
                max={5}
                value={stateProductDetails.rating}
                onChange={(value) =>
                  setStateProductDetails((prev) => ({
                    ...prev,
                    rating: value,
                  }))
                }
                name="rating"
              />
            </Form.Item>
            <Form.Item label="Image" name="image">
              <WrapperUploadFile
                onChange={handleUploadImageDetails}
                maxCount={1}
              >
                <Button>Select image</Button>
              </WrapperUploadFile>
              {stateProductDetails.image && (
                <img
                  src={stateProductDetails.image}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: 10,
                  }}
                  alt="avatar"
                />
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
      <ModalComponent
        title="Xóa sản phẩm"
        open={isModalOpenDelete}
        onCancel={handleCancelDelete}
        onOk={handleDeleteProduct}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn chắc chắn muốn xóa sản phẩm này ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};
