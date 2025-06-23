import { InfoCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, Form, Modal, Table, Tag } from "antd";
import moment from "moment";
import { useState } from "react";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useGetEarningsQuery } from "../../redux/features/dashboard/dashboardApi";
import { imageBaseUrl } from "../../config/imageBaseUrl";

const { Item } = Form;

const Earnings = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterParams, setFilterParams] = useState({});

  const { data: earningsData, isLoading, isError } = useGetEarningsQuery({
    ...filterParams,
    page: currentPage
  });

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const formatPhoneNumber = (phoneNumber, callingCode) => {
    return callingCode ? `${callingCode} ${phoneNumber}` : phoneNumber;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusTag = (status) => {
    let color = '';
    let text = '';
    
    switch(status) {
      case 'completed':
        color = 'green';
        text = 'Completed';
        break;
      case 'panding': // Note: This might be a typo in your API (should be 'pending')
        color = 'orange';
        text = 'Pending';
        break;
      default:
        color = 'gray';
        text = status;
    }
    
    return <Tag color={color}>{text}</Tag>;
  };

  const columns = [
    {
      title: "#Trx ID",
      dataIndex: "checkoutSessionId",
      key: "trxId",
      render: (text) => text ? `#${text.slice(0, 8).toUpperCase()}` : 'N/A',
      width: 120,
    },
    {
      title: "User Name",
      dataIndex: ["user", "fullName"],
      key: "userName",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={`${imageBaseUrl}${record.user?.profileImage || '/uploads/users/user.png'}`}
            alt="avatar"
            onError={(e) => {
              e.target.src = `${imageBaseUrl}/uploads/users/user.png`;
            }}
          />
          {text || 'N/A'}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: ["user", "phoneNumber"],
      key: "phoneNumber",
      render: (text, record) => formatPhoneNumber(text, record.user?.callingCode),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => formatCurrency(amount || 0),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "date",
      render: (text) => moment(text).format("DD MMM, YYYY"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    
    {
      title: "Actions",
      key: "action",
      width: 80,
      render: (_, record) => (
        <InfoCircleOutlined
          className="cursor-pointer text-lg text-[#77C4FE] hover:text-[#5aa8e6] transition-colors"
          onClick={() => showModal(record)}
        />
      ),
    },
  ];

  const calculateTotalEarnings = (status = null) => {
    if (!earningsData?.results) return 0;
    
    return earningsData.results
      .filter(earning => !status || earning.status === status)
      .reduce((total, earning) => total + (earning.amount || 0), 0);
  };

  const todayEarnings = calculateTotalEarnings('completed');
  const allEarnings = calculateTotalEarnings();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading earnings data...</div>;
  }

  if (isError) {
    return <div className="text-red-500 p-4">Error loading earnings data!</div>;
  }

  return (
    <section className="px-2 mt-5">
      <div className="rounded-lg">
        <div className="md:flex justify-start items-center">
          <div className="w-64">   
            <h1 className="text-xl font-semibold flex items-center">
              <MdKeyboardArrowLeft /> Earning List
            </h1>
          </div>
          <div className="flex-none p-5 ml-5">
            <Form layout="inline" className="space-x-4 pl-5">
              <button 
                className="flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md hover:bg-[#5aa8e6] transition-colors"
              >
                <FaArrowRightArrowLeft className="size-5" />
                <p className="px-2">Today's Earning {formatCurrency(todayEarnings)}</p>
              </button>
              <button 
                className="flex justify-center items-center bg-[#77C4FE] text-white px-3 py-2 rounded-md hover:bg-[#5aa8e6] transition-colors"
              >
                <FaArrowRightArrowLeft className="size-5" />
                <p className="px-2">All Earning {formatCurrency(allEarnings)}</p>
              </button>
            </Form>
          </div>
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
              
                headerBorderRadius: 2,
              },
            },
          }}
        >
          <Table
            loading={isLoading}
            className="shadow-sm"
            dataSource={earningsData?.results || []}
            columns={columns}
            rowKey="_id"
            pagination={{
              current: currentPage,
              pageSize: earningsData?.limit || 10,
              total: earningsData?.totalResults || 0,
              onChange: (page) => setCurrentPage(page),
              position: ["bottomRight"],
              showSizeChanger: false,
            }}
            scroll={{ x: 1000 }}
          />
        </ConfigProvider>
      </div>

      {/* Transaction Details Modal */}
      <Modal
        title={<span className="text-xl font-semibold">Transaction Details</span>}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        centered
        width={700}
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '16px',
          },
          body: {
            padding: '24px',
          },
        }}
        closeIcon={
          <div className="flex items-center justify-center size-8 bg-[#77C4FE] rounded-full text-white hover:bg-[#5aa8e6] transition-colors">
            ×
          </div>
        }
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col items-center">
                <img
                  className="size-24 rounded-full object-cover border-4 border-[#77C4FE]"
                  src={`${imageBaseUrl}${selectedRecord?.user?.profileImage || '/uploads/users/user.png'}`}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = `${imageBaseUrl}/uploads/users/user.png`;
                  }}
                />
                <h3 className="mt-2 font-medium">{selectedRecord?.user?.fullName}</h3>
                <p className="text-gray-500">User</p>
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold">Transaction ID: {selectedRecord?.checkoutSessionId?.slice(0, 8).toUpperCase() || 'N/A'}</h3>
                <p className="text-gray-500">Status: {getStatusTag(selectedRecord?.status)}</p>
                <p className="text-gray-500">Amount: {formatCurrency(selectedRecord?.amount)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-medium text-gray-500">Appointment ID</p>
                  <p>{selectedRecord?.appointmentId || "N/A"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-medium text-gray-500">Appointment Date</p>
                  <p>{selectedRecord?.appointmentDate ? moment(selectedRecord.appointmentDate).format("DD MMM YYYY") : "N/A"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-medium text-gray-500">Time Slot</p>
                  <p>{selectedRecord?.appointmentTimeSlot || "N/A"}</p>
                </div>
                <div className="border-b border-gray-100 pb-3">
                  <p className="font-medium text-gray-500">Payment Method</p>
                  <p>{selectedRecord?.mode ? selectedRecord.mode.charAt(0).toUpperCase() + selectedRecord.mode.slice(1) : "N/A"}</p>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Patient Name</p>
                <p>{selectedRecord?.patientName || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Patient Email</p>
                <p>{selectedRecord?.patientEmail || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Patient Phone</p>
                <p>{formatPhoneNumber(selectedRecord?.patientPhone, selectedRecord?.user?.callingCode) || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Patient Address</p>
                <p>{selectedRecord?.patientAddress || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Visit Type</p>
                <p>{selectedRecord?.visitType || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Category</p>
                <p>{selectedRecord?.category || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Reason</p>
                <p>{selectedRecord?.reason || "N/A"}</p>
              </div>
              <div className="border-b border-gray-100 pb-3">
                <p className="font-medium text-gray-500">Transaction Date</p>
                <p>{selectedRecord?.createdAt ? moment(selectedRecord.createdAt).format("DD MMM YYYY hh:mm A") : "N/A"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Earnings;