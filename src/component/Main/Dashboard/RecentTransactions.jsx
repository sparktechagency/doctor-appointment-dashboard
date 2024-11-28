import { useState } from "react";
import { Modal, Space, Table, ConfigProvider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const RecentTransactions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const data = [
    {
      key: "1",
      transactionId: "12345678",
      PatientName: "Enrique",
      Email: "example@gmail.com",
      Phone: "01317597092",
      date: "16 Apr 2024",
    },
    {
      key: "2",
      transactionId: "12345678",
      PatientName: "Enrique",
      Email: "example@gmail.com",
      Phone: "01317597092",
      date: "16 Apr 2024",
    },
    {
      key: "3",
      transactionId: "12345678",
      PatientName: "Enrique",
      Email: "example@gmail.com",
      Phone: "01317597092",
      date: "16 Apr 2024",
    },
    {
      key: "4",
      transactionId: "12345678",
      PatientName: "Enrique",
      Email: "example@gmail.com",
      Phone: "01317597092",
      date: "16 Apr 2024",
    },
    {
      key: "5",
      transactionId: "12345678",
      PatientName: "Enrique",
      Email: "example@gmail.com",
      Phone: "01317597092",
      date: "16 Apr 2024",
    },
    // {
    //   key: "6",
    //   transactionId: "12345679",
    //   userName: "Enrique",
    //   boxPackage: "John Doe",
    //   amount: "$230",
    //   date: "15 Apr 2024",
    // },
  ];

  const showModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

  const columns = [
    {
      title: "#ID",
      dataIndex: "transactionId",
      key: "transactionId",
    },
    {
      title: "Patient name",
      dataIndex: "PatientName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
    },
    {
      title: "Phone number",
      dataIndex: "Phone",
      key: "Phone",
    },
    {
      title: "Appointment date ",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "N/A"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <InfoCircleOutlined
            onClick={() => showModal(record)}
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full col-span-full md:col-span-6  rounded-lg  ">
      <h2 className="font-semibold py-3 pl-5">Recent Transactions</h2>
      <ConfigProvider
  theme={{
    token: {
      colorBgContainer: "",
      colorPrimary: "", // Custom primary color
    },
    components: {
      Table: {
        colorBgContainer: "",
        colorFillAlter: "#3780f9", // Table header background color
        colorTextHeading: "#ffffff", // Header text color for contrast
      },
    },
  }}
>
  <Table columns={columns} dataSource={data} pagination={false}  scroll={{ x: 800 }} />
</ConfigProvider>
      {/* Modal */}
      <Modal
        open={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div className="text-black p-2">
          <h1 className="text-center text-xl font-semibold my-2 text-gray-500">
            Transaction Details
          </h1>
          <div className="p-5">
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Transaction ID :</p>
              <p>{selectedTransaction?.transactionId || "N/A"}</p>
            </div>
          
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>User name :</p>
              <p>{selectedTransaction?.PatientName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Email :</p>
              <p>{selectedTransaction?.Email || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Phone Number:</p>
              <p>{selectedTransaction?.Phone || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Appointment Date:</p>
              <p>
                {selectedTransaction?.date
                  ? moment(selectedTransaction.date).format("DD MMM YYYY")
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="flex space-x-4 w-full px-5">
            <button className="w-full bg-white text-black border border-gray-300 py-2 px-4 rounded-xl">
              Download
            </button>
            <button className="w-full bg-primary text-white py-2 px-4 rounded-xl">
              Print
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecentTransactions;
