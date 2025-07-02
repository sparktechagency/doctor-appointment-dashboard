import { InfoCircleOutlined } from "@ant-design/icons";
import { ConfigProvider, DatePicker, Form, Input, Table } from "antd";
import moment from "moment";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { useGetAppointmentsQuery } from "../../../redux/features/dashboard/dashboardApi";

const { Item } = Form;

const AppointmentList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    page: 1,
    sortBy: "createdAt:desc"
  });

  const { data: appointments, isLoading, isFetching } = useGetAppointmentsQuery(queryParams);

  const navigateToDetails = (record) => {
    navigate(`/appointments/${record.appointmentId}`);
  };

  const onFinish = (values) => {
    const newParams = {
      ...queryParams,
      page: 1, // Reset to first page when filtering
      patientName: values.patientName,
      date: values.date ? moment(values.date).format("YYYY-MM-DD") : undefined,
      status: values.status
    };
    setQueryParams(newParams);
  };

  const handleTableChange = (pagination) => {
    setQueryParams(prev => ({
      ...prev,
      page: pagination.current
    }));
  };

  const columns = [
    {
      title: "#Trx ID",
      dataIndex: "appointmentId",
      key: "appointmentId",
    },
    {
      title: "User Name",
      dataIndex: ["booker", "fullName"],
      key: "fullName",
      render: (text, record) => (
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full mr-2"
            src={`${imageBaseUrl}${record.booker?.profileImage}`}
            alt="avatar"
            
          />
          {text}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "patientEmail",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "patientPhone",
      key: "phone",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => moment(text).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "action",
      render: (text, record) => (
        <InfoCircleOutlined
          className="cursor-pointer text-xl"
          onClick={() => navigateToDetails(record)}
        />
      ),
    },
  ];

  return (
    <section className="px-2 mt-5">
      <div className="rounded-lg">
        <div className="flex justify-between items-center py-5">
          <h1 className="md:text-2xl font-semibold py-2 flex items-center">
            <MdKeyboardArrowLeft /> Appointment List
          </h1>
          <Form
            form={form}
            className="flex px-3 py-[22px] justify-between items-center p-2"
            layout="inline"
            onFinish={onFinish}
          >
            <Item name="date">
              <DatePicker placeholder="Date" />
            </Item>
            <Item name="patientName">
              <Input placeholder="Patient name" />
            </Item>
            <Item>
              <button 
                type="submit"
                className="size-8 rounded-full flex justify-center items-center bg-[#77C4FE] text-white"
              >
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
                headerBorderRadius: 2,
              },
            },
          }}
        >
          <Table
            className="shadow-sm"
            dataSource={appointments?.results || []}
            columns={columns}
            loading={isLoading || isFetching}
            pagination={{
              current: queryParams.page,
              pageSize: 10,
              total: appointments?.totalResults || 0,
              position: ["bottomCenter"]
            }}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            rowKey="_id"
          />
        </ConfigProvider>
      </div>
    </section>
  );
};

export default AppointmentList;