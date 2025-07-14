import { useState } from "react";
import { Modal, Space, Table, ConfigProvider } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {  useGetRecentAppointmentsQuery  } from "../../../redux/features/dashboard/dashboardApi";

const RecentTransactions = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch appointments data using RTK Query
  const { data: appointmentsData, isLoading } =  useGetRecentAppointmentsQuery ({
    sortBy: "createdAt:desc"
  });

  // Transform the API data to match the table structure
  const data = appointmentsData?.map((appointment, index) => ({
    key: appointment._id || index,
    transactionId: appointment.appointmentId,
    PatientName: appointment.patientName,
    Email: appointment.patientEmail,
    Phone: appointment.patientPhone,
    date: appointment.date,
    status: appointment.status,
    isPaid: appointment.isPaid,
    paymentDetails: appointment.paymentDetails,
    _id: appointment._id
  })) || [];

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
      key: "transactionId"
    },
    {
      title: "Patient name",
      dataIndex: "PatientName",
      key: "userName"
    },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email"
    },
    {
      title: "Phone number",
      dataIndex: "Phone",
      key: "Phone"
    },
    {
      title: "Appointment date ",
      dataIndex: "date",
      key: "date",
      render: (text) => (text ? moment(text).format("DD MMM YYYY") : "N/A")
    },
    
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button onClick={() => showModal(record)}
            style={{ fontSize: "18px", cursor: "pointer" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.97928 10.2709C4.36459 8.19808 7.26856 5 12 5C16.7314 5 19.6354 8.19808 21.0207 10.2709C21.4856 10.9665 21.718 11.3143 21.6969 11.9569C21.6757 12.5995 21.4089 12.9469 20.8752 13.6417C19.2861 15.7107 16.113 19 12 19C7.88704 19 4.71388 15.7107 3.12475 13.6417C2.59111 12.9469 2.32428 12.5995 2.30313 11.9569C2.28197 11.3143 2.51441 10.9665 2.97928 10.2709ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 7.99999 9.79086 7.99999 12C7.99999 14.2091 9.79086 16 12 16Z" fill="#414141"/>
</svg>
</button>
            
         
        </Space>
      )
    }
  ];

  return (
    <div className="w-full col-span-full md:col-span-6 rounded-lg">
      <h2 className="font-semibold py-3 pl-5">Recent Appointments</h2>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "#3780f9",
            colorPrimary: ""
          },
          components: {
            Table: {
              colorBgContainer: "",
              colorFillAlter: "#77C4FE",
              
            }
          }
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ x: 800 }}
          loading={isLoading}
        />
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
            Appointment Details
          </h1>
          <div className="p-5">
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Appointment ID:</p>
              <p>{selectedTransaction?.transactionId || "N/A"}</p>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Patient name:</p>
              <p>{selectedTransaction?.PatientName || "N/A"}</p>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Email:</p>
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
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Status:</p>
              <p className={`px-2 py-1 rounded-full text-xs ${
                selectedTransaction?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                selectedTransaction?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedTransaction?.status || "N/A"}
              </p>
            </div>
            <div className="flex justify-between py-3 border-t-2 border-gray-400">
              <p>Payment Status:</p>
              <p className={`px-2 py-1 rounded-full text-xs ${
                selectedTransaction?.isPaid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {selectedTransaction?.isPaid ? "Paid" : "Unpaid"}
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