/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Table, Modal,  ConfigProvider, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { IoIosSearch } from "react-icons/io";
import moment from "moment";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";

const { Item } = Form;

const Earnings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const dataSource = [
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "1",
      trxId: "#12345678",
      userName: "tom",
      date: "22 Jan, 2024",
      email: "Example@gmail.com",
      PhoneNumber:"01217597492",
      user: {
        name: "Tom",
        email: "tom@example.com",
        phone: "555-1234",
        address: "123 Main St",
        gender: "Male",
        createdAt: "2024-01-22",
      },
    },
    {
      key: "2",
      trxId: "#87654321",
      userName: "jane",
      date: "23 Jan, 2024",
      email: "Example@gmail.com",
      boxPhoneNumber:"01217597492",
      user: {
        name: "Jane",
        email: "jane@example.com",
        phone: "555-5678",
        address: "456 Maple Ave",
        gender: "Female",
        createdAt: "2024-01-23",
      },
    },
    {
      key: "2",
      trxId: "#87654321",
      userName: "jane",
      date: "23 Jan, 2024",
      email: "Example@gmail.com",
      boxPhoneNumber:"01217597492",
      user: {
        name: "Jane",
        email: "jane@example.com",
        phone: "555-5678",
        address: "456 Maple Ave",
        gender: "Female",
        createdAt: "2024-01-23",
      },
    },
    {
      key: "2",
      trxId: "#87654321",
      userName: "jane",
      date: "23 Jan, 2024",
      email: "Example@gmail.com",
      boxPhoneNumber:"01217597492",
      user: {
        name: "Jane",
        email: "jane@example.com",
        phone: "555-5678",
        address: "456 Maple Ave",
        gender: "Female",
        createdAt: "2024-01-23",
      },
    },
    {
      key: "2",
      trxId: "#87654321",
      userName: "jane",
      date: "23 Jan, 2024",
      email: "Example@gmail.com",
      boxPhoneNumber:"01217597492",
      user: {
        name: "Jane",
        email: "jane@example.com",
        phone: "555-5678",
        address: "456 Maple Ave",
        gender: "Female",
        createdAt: "2024-01-23",
      },
    },
    {
      key: "2",
      trxId: "#87654321",
      userName: "jane",
      date: "23 Jan, 2024",
      email: "Example@gmail.com",
      boxPhoneNumber:"01217597492",
      user: {
        name: "Jane",
        email: "jane@example.com",
        phone: "555-5678",
        address: "456 Maple Ave",
        gender: "Female",
        createdAt: "2024-01-23",
      },
    },
    // Add more entries as needed
  ];

  const columns = [
    {
      title: "#Trx ID",
      dataIndex: "trxId",
      key: "trxId",
    },
    {
      title: "User Name",
      dataIndex: "userName",
      key: "userName",
      render: (text) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="avatar"
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
      dataIndex: "PhoneNumber",
      key: "PhoneNumber",
    },
    {
      title: "Date ",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <InfoCircleOutlined
          className="cursor-pointer text-xl"
          onClick={() => showModal(record)}
        />
      ),
    },
  ];

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <section className="px-2 mt-5">
      <div className=" rounded-lg ">
        <div className="md:flex justify-between items-center  py-5">
          <h1 className="text-xl font-semibold flex items-center "><MdKeyboardArrowLeft /> Earning List</h1>
          <Form layout="inline" className="flex space-x-4">
            <button className=" flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md">
                <FaArrowRightArrowLeft  className="size-5" />
                <p className="px-2"> Today’s Earning $3230</p>
            </button>
            <button className=" flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md">
                <FaArrowRightArrowLeft  className="size-5" />
                <p className="px-2">All Earning $5230</p>
            </button>
          </Form>
        </div>
        <ConfigProvider
          theme={{
            token: {
              colorBgContainer: "#D5EDFF",
              colorPrimary: "#1890ff", // Custom primary color
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
           
            className="shadow-sm"
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 8, position: ["bottomCenter"] }}
            scroll={{ x: 800 }} 
          />
        </ConfigProvider>
      </div>

      {/* User Details Modal */}
      <Modal
        open={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="text-black">
          <h1 className="text-center text-2xl font-semibold my-2">
            Transaction Details
          </h1>
          <div className="p-5">
            <div className="flex justify-between py-3 border-b">
              <p>User Name :</p>
              <p>{selectedRecord?.user?.name || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Email :</p>
              <p>{selectedRecord?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Phone Number :</p>
              <p>{selectedRecord?.PhoneNumber || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Address :</p>
              <p>{selectedRecord?.user?.address || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Gender :</p>
              <p>{selectedRecord?.user?.gender || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3">
              <p>Joining Date :</p>
              <p>
                {selectedRecord?.user?.createdAt
                  ? moment(selectedRecord.user.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Earnings;
