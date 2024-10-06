import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Input, message, Space, Switch } from "antd";
import TableComponent from "../Table/Table";
import { ModalComponent } from "../Modal/Modal";
import Loading from "../Loading/Loading";
import InputComponent from "../Input/Input";
import DrawerComponent from "../Drawer/Drawer";
import {
  PlusCircleFilled,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import { getBase64 } from "../../services/utils";

export const AdminUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsDrawerOpen] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const user = useSelector((state) => state?.user);
  const searchInput = useRef(null);
  const [stateUser, setStateUser] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    address: "",
    avatar: "",
    city: "",
  });

  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    isAdmin: false,
    address: "",
    avatar: "",
    city: "",
  });

  const [createUserForm] = Form.useForm();
  const [updateUserForm] = Form.useForm();

  const mutation = useMutationHook((data) => UserService.signUpUser(data));

  const mutationUpdate = useMutationHook((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, token, { ...rests });
    return res;
  });

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token);
    return res;
  };

  const mutationDelete = useMutationHook((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const mutationDeleteMany = useMutationHook((data) => {
    const { token, ...ids } = data;
    const res = UserService.deleteManyUser(ids, token);
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

  const handleDeleteManyUsers = (ids) => {
    mutationDeleteMany.mutate(
      { ids: ids, token: user?.access_token },
      {
        onSuccess: () => {
          queryUser.refetch();
        },
      }
    );
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
    retry: 3,
    retryDelay: 1000,
  });
  const { isPending: isPendingUsers, data: users } = queryUser;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("User created successfully");
      handleCancel();
    } else if (isError) {
      message.error("Error occurred while creating user");
      handleCancel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("User updated successfully");
      handleCancelDrawer();
    } else if (isErrorUpdated) {
      message.error("Error occurred while updating user");
      handleCancelDrawer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessUpdated, isErrorUpdated]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Delete user successfully");
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Error occurred while delete user");
      handleCancelDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeleted, isErrorDeleted]);

  useEffect(() => {
    if (isSuccessDeletedMany && dataDeletedMany?.status === "OK") {
      message.success("Delete list user successfully");
      handleCancelDelete();
    } else if (isErrorDeletedMany) {
      message.error("Error occurred while delete user");
      handleCancelDelete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessDeletedMany, isErrorDeletedMany]);

  const fetchDetailsUser = async (id) => {
    try {
      const res = await UserService.getDetailsUser(id);
      if (res?.data) {
        setStateUserDetails({
          name: res?.data?.name,
          email: res?.data?.email,
          phone: res?.data?.phone,
          isAdmin: res?.data?.isAdmin,
          address: res?.data?.address,
          avatar: res?.data?.avatar,
          city: res?.data?.city,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      message.error("Failed to fetch user details");
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchDetailsUser(rowSelected);
    }
  }, [rowSelected]);

  useEffect(() => {
    updateUserForm.setFieldsValue(stateUserDetails);
  }, [updateUserForm, stateUserDetails]);

  const handleDetailsUser = () => {
    setIsDrawerOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    createUserForm.resetFields();
    setStateUser({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
      address: "",
      avatar: "",
      city: "",
    });
  };

  const handleCancelDrawer = () => {
    setIsDrawerOpen(false);
    updateUserForm.resetFields();
  };

  const onFinish = () => {
    mutation.mutate(stateUser, {
      onSuccess: () => {
        queryUser.refetch();
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStateUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChangeDetails = (e) => {
    const { name, value } = e.target;
    setStateUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = async (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const base64 = await getBase64(file);
      setStateUser({
        ...stateUser,
        avatar: base64,
      });
    } else {
      message.error("No file uploaded or file is not valid");
    }
  };

  const handleUploadImageDetails = async (info) => {
    const file = info.fileList[0]?.originFileObj;
    if (file) {
      const base64 = await getBase64(file);
      setStateUserDetails({
        ...stateUserDetails,
        avatar: base64,
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
          onClick={handleDetailsUser}
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
    },
    {
      title: "Email",
      dataIndex: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      filters: [
        {
          text: "True",
          value: true,
        },
        {
          text: "False",
          value: false,
        },
      ],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: renderAction,
    },
  ];

  const dataTable =
    users?.data?.length &&
    users?.data?.map((user) => {
      return {
        ...user,
        key: user._id,
        isAdmin: user.isAdmin ? "TRUE" : "FALSE",
      };
    });

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSuccess: () => {
          queryUser.refetch();
          fetchDetailsUser(rowSelected);
        },
      }
    );
  };

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDelete.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSuccess: () => {
          queryUser.refetch();
        },
      }
    );
  };

  return (
    <div>
      <WrapperHeader>Quản lí người dùng</WrapperHeader>
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
          handleDeleteMany={handleDeleteManyUsers}
          columns={columns}
          data={dataTable}
          isPending={isPendingUsers | isPendingDeletedMany | isPendingDeleted}
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
            form={createUserForm}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUser.name}
                onChange={handleInputChange}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUser.email}
                onChange={handleInputChange}
                name="email"
              />
            </Form.Item>
            <Form.Item label="Admin" name="isAdmin" valuePropName="checked">
              <Switch
                checked={stateUser.isAdmin}
                onChange={(checked) =>
                  setStateUser((prev) => ({ ...prev, isAdmin: checked }))
                }
                name="isAdmin"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUser.phone}
                onChange={handleInputChange}
                name="phone"
              />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleInputChange}
                name="address"
              />
            </Form.Item>

            <Form.Item label="City" name="city">
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleInputChange}
                name="city"
              />
            </Form.Item>
            <Form.Item label="Avatar" name="avatar">
              <WrapperUploadFile onChange={handleUploadImage} maxCount={1}>
                <Button>Select image</Button>
              </WrapperUploadFile>
              {stateUser.avatar && (
                <img
                  src={stateUser.avatar}
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
            onFinish={onUpdateUser}
            autoComplete="off"
            form={updateUserForm}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails.name}
                onChange={handleInputChangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your email!" }]}
            >
              <InputComponent
                value={stateUserDetails.sku}
                onChange={handleInputChangeDetails}
                name="sku"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.type}
                onChange={handleInputChangeDetails}
                name="type"
              />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleInputChangeDetails}
                name="address"
              />
            </Form.Item>

            <Form.Item label="City" name="city">
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleInputChangeDetails}
                name="city"
              />
            </Form.Item>

            <Form.Item label="Admin" name="isAdmin" valuePropName="checked">
              <Switch
                checked={stateUserDetails.isAdmin}
                onChange={(checked) =>
                  setStateUserDetails((prev) => ({ ...prev, isAdmin: checked }))
                }
                name="isAdmin"
              />
            </Form.Item>

            <Form.Item label="Avatar" name="avatar">
              <WrapperUploadFile
                onChange={handleUploadImageDetails}
                maxCount={1}
              >
                <Button>Select image</Button>
              </WrapperUploadFile>
              {stateUserDetails.avatar && (
                <img
                  src={stateUserDetails.avatar}
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
        onOk={handleDeleteUser}
      >
        <Loading isPending={isPendingDeleted}>
          <div>Bạn chắc chắn muốn xóa sản phẩm này ?</div>
        </Loading>
      </ModalComponent>
    </div>
  );
};
