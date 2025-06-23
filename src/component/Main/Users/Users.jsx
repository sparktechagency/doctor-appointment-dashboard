import {
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Modal,
  Space,
  Table,
} from "antd";
import moment from "moment";
import { useState } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { useGetAllUsersQuery } from "../../../redux/features/dashboard/dashboardApi";

const { Item } = Form;

const Users = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState("");
  const [searchParams, setSearchParams] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  
  const { data: usersData, isFetching } = useGetAllUsersQuery({
    ...searchParams,
    page: currentPage
  });

  const handleView = (record) => {
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  const formatPhoneNumber = (phoneNumber, callingCode) => {
    return callingCode ? `${callingCode} ${phoneNumber}` : phoneNumber;
  };

  const dataSource = usersData?.results?.map((user, index) => ({
    key: user._id,
    si: index + 1 + ((currentPage - 1) * 10),
    name: user?.fullName,
    email: user?.email,
    address: user?.address_line1,
    image: user?.profileImage,
    phone: formatPhoneNumber(user?.phoneNumber, user?.callingCode),
    createdAt: user?.createdAt,
    rawUserData: user
  }));

  const columns = [
    {
      title: "#SI",
      dataIndex: "si",
      key: "index",
    },
    {
      title: "User Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={`${imageBaseUrl}${record.image}`}
            alt="avatar"
            onError={(e) => {
              e.target.src = "https://randomuser.me/api/portraits/men/1.jpg";
            }}
          />
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <BsInfoCircle
            onClick={() => handleView(record)}
            size={18}
            className="text-[#111111] cursor-pointer"
          />
        </Space>
      ),
    },
  ];

  const onFinish = (values) => {
    const params = {};
    
    if (date) {
      params.date = date;
    }
    if (values.username) {
      params.userName = values.username;
    }
    
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handleDate = (date, dateString) => {
    setDate(dateString);
  };

  return (
    <section className="px-2 mt-5">
      <div className="rounded-lg">
        <div className="flex justify-between items-center py-5">
          <h1 className="md:text-2xl font-semibold py-2 flex items-center">
            <MdKeyboardArrowLeft /> Users List
          </h1>
          <Form
            className="flex px-3 py-[22px] justify-between items-center p-2"
            layout="inline"
            onFinish={onFinish}
          >
            <Item>
              <DatePicker placeholder="Date" onChange={handleDate} />
            </Item>
            <Item name="username">
              <Input placeholder="User name" />
            </Item>
            <Item>
              <button className="size-8 rounded-full flex justify-center items-center bg-[#77C4FE] text-white">
                <IoIosSearch className="size-5" />
              </button>
            </Item>
          </Form>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: "#D5EDFF",
              colorPrimary: "#1890ff",
            },
            components: {
              Table: {
                headerBg: "#77C4FE",
                headerColor: "white",
                headerBorderRadius: 2,
              },
            },
          }}
        >
          <Table
            loading={isFetching}
            pagination={{
              current: currentPage,
              pageSize: usersData?.limit || 10,
              total: usersData?.totalResults || 0,
              onChange: setCurrentPage,
              position: ["bottomCenter"]
            }}
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 800 }}
          />
        </ConfigProvider>
      </div>

      <Modal
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        styles={{
          header: {
            borderBottom: 'none',
            paddingBottom: 0,
          },
          mask: {
            backdropFilter: 'blur(3px)',
          },
          close: {
            background: '#77C4FE',
            color: 'black',
            top: 10,
            insetInlineEnd: 10,
          },
        }}
        closeIcon={
          <span className="flex items-center justify-center w-10 h-10 bg-red-500 rounded-tr-lg rounded-bl-2xl">
            ×
          </span>
        }
      >
        <div className="text-black bg-white">
          <h1 className="text-center text-2xl font-semibold my-2">
            User Details
          </h1>
          <div className="p-5">
            <div className="flex justify-between py-3 border-b">
              <p>User Name :</p>
              <p>{selectedUser?.name || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Email :</p>
              <p>{selectedUser?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Phone Number :</p>
              <p>{selectedUser?.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Address :</p>
              <p>{selectedUser?.address || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3">
              <p>Joining Date :</p>
              <p>
                {selectedUser?.createdAt
                  ? moment(selectedUser.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Users;