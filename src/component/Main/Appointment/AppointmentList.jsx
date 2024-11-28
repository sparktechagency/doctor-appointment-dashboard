import { InfoCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, DatePicker, Form, Input, Modal, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { imageBaseUrl } from "../../../config/imageBaseUrl";

const { Item } = Form;

const AppointmentList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [date, setDate] = useState(null); // Added state for selected date

  const dataSource = [
    {
      id: 1,
      fullName: "John Doe",
      email: "john.doe@example.com",
      address_line1: "123 Main St, Springfield",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "123-456-7890",
      createdAt: "2023-01-15T10:15:30Z",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      address_line1: "456 Oak St, Metropolis",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "987-654-3210",
      createdAt: "2023-02-20T14:45:00Z",
    },
    {
      id: 3,
      fullName: "Alice Johnson",
      email: "alice.johnson@example.com",
      address_line1: "789 Maple Ave, Gotham",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "456-123-7890",
      createdAt: "2023-03-12T09:30:15Z",
    },
    {
      id: 4,
      fullName: "Bob Brown",
      email: "bob.brown@example.com",
      address_line1: "321 Elm St, Star City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "321-654-0987",
      createdAt: "2023-04-10T11:20:45Z",
    },
    {
      id: 5,
      fullName: "Cathy White",
      email: "cathy.white@example.com",
      address_line1: "654 Pine St, Central City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "654-321-0987",
      createdAt: "2023-05-15T13:30:50Z",
    },
    {
      id: 6,
      fullName: "David Green",
      email: "david.green@example.com",
      address_line1: "987 Birch St, Coast City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "789-012-3456",
      createdAt: "2023-06-20T08:15:10Z",
    },
    {
      id: 7,
      fullName: "Eva Black",
      email: "eva.black@example.com",
      address_line1: "135 Cedar St, Smallville",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "246-801-3579",
      createdAt: "2023-07-25T16:45:30Z",
    },
    {
      id: 8,
      fullName: "Frank Blue",
      email: "frank.blue@example.com",
      address_line1: "246 Cherry St, Happy Town",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "135-790-8642",
      createdAt: "2023-08-30T07:50:20Z",
    },
    {
      id: 9,
      fullName: "Grace Gray",
      email: "grace.gray@example.com",
      address_line1: "369 Willow St, Dreamland",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "852-963-7410",
      createdAt: "2023-09-05T10:10:10Z",
    },
    {
      id: 10,
      fullName: "Hank Red",
      email: "hank.red@example.com",
      address_line1: "159 Maplewood St, Wonder City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "963-852-7410",
      createdAt: "2023-10-12T09:05:25Z",
    },
    {
      id: 11,
      fullName: "Frank Blue",
      email: "frank.blue@example.com",
      address_line1: "246 Cherry St, Happy Town",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "135-790-8642",
      createdAt: "2023-08-30T07:50:20Z",
    },
    {
      id: 12,
      fullName: "Grace Gray",
      email: "grace.gray@example.com",
      address_line1: "369 Willow St, Dreamland",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "852-963-7410",
      createdAt: "2023-09-05T10:10:10Z",
    },
    {
      id: 13,
      fullName: "Hank Red",
      email: "hank.red@example.com",
      address_line1: "159 Maplewood St, Wonder City",
      image: { url: `${imageBaseUrl}/default.jpg` },
      phone: "963-852-7410",
      createdAt: "2023-10-12T09:05:25Z",
    },
  ];

  const columns = [
    {
      title: "#Trx ID",
      dataIndex: "id", // Assuming 'id' as the transaction ID
      key: "id",
    },
    {
      title: "User Name",
      dataIndex: "fullName", // Using 'fullName' as the user name
      key: "fullName",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={record.image.url} // Assuming 'image.url' is the user avatar
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
      dataIndex: "phone", // Using 'phone' instead of 'PhoneNumber'
      key: "phone",
    },
    {
      title: "Date",
      dataIndex: "createdAt", // Using 'createdAt' as the date
      key: "createdAt",
      render: (text) => new Date(text).toLocaleDateString(), // Formatting the date
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

  const onFinish = (values) => {
    let queryParams = [];
    const { username } = values;
    if (date) {
      queryParams.push({ name: "date", value: date });
    }
    if (username) {
      queryParams.push({ name: "userName", value: username });
    }
    // setParams(queryParams);
  };

  const handleDate = (date, dateString) => {
    setDate(dateString); // Set the selected date to the state
  };

  return (
    <section className="px-2 mt-5">
      <div className=" rounded-lg ">
        <div className="flex justify-between items-center  py-5">
          <h1 className="md:text-2xl font-semibold  py-2 flex items-center">
            <MdKeyboardArrowLeft /> Appointment List
          </h1>
          <Form
            className="flex px-3 py-[22px] justify-between items-center p-2 "
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
              <button className=" size-8 rounded-full flex justify-center items-center bg-secondary text-white">
                <IoIosSearch className="size-5" />
              </button>
            </Item>
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
                headerBg: "#3780f9",
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
              <p>{selectedRecord?.fullName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Email :</p>
              <p>{selectedRecord?.email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Phone Number :</p>
              <p>{selectedRecord?.phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Address :</p>
              <p>{selectedRecord?.address_line1 || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-b">
              <p>Created At :</p>
              <p>
                {selectedRecord?.createdAt
                  ? moment(selectedRecord.createdAt).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AppointmentList;
