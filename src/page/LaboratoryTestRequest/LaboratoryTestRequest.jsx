import { useState } from "react";
import { Form, Button, Table, Tag } from "antd";
import CustomInput from "../../utils/CustomInput";
import CustomDatePicker from "../../utils/CustomDatePicker";
import CustomSelect from "../../utils/CustomSelect";

const LaboratoryTestRequest = () => {
  const [form] = Form.useForm();
  const [requests, setRequests] = useState([]);

  const handleFormSubmit = (values) => {
    const newRequest = {
      key: requests.length + 1,
      patientName: values.patientName,
      testType: values.testType,
      testDate: values.testDate.format("YYYY-MM-DD"),
      notes: values.notes || "",
      status: "Pending",
    };
    setRequests([...requests, newRequest]);
    form.resetFields();
  };

  const items = [
    {
      label: "Blood Test",
      value: "bloodTest",
    },
    {
      label: "Urine Test",
      value: "urineTest",
    },
    {
      label: "X-ray",
      value: "x-ray",
    },
    {
      label: "CT Scan",
      value: "ctScan",
    },
    {
      label: "MRI",
      value: "mri",
    },
  ];
  const columns = [
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Test Type",
      dataIndex: "testType",
      key: "testType",
    },
    {
      title: "Test Date",
      dataIndex: "testDate",
      key: "testDate",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Pending" ? "blue" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div className="p-5">
      {/* Form for Requesting Laboratory Test */}
      <h2 className="text-xl font-semibold mb-4">Request Laboratory Test</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <Form.Item
          label="Patient Name"
          name="patientName"
          rules={[
            { required: true, message: "Please enter the patient's name" },
          ]}
        >
          <CustomInput placeholder="Enter patient name" />
        </Form.Item>

        <Form.Item
          label="Test Type"
          name="testType"
          rules={[{ required: true, message: "Please select the test type" }]}
        >
          <CustomSelect
            placeholder={"Select test type"}
            options={items}
          />
        </Form.Item>

        <Form.Item
          label="Test Date"
          name="testDate"
          rules={[{ required: true, message: "Please select the test date" }]}
        >
          <CustomDatePicker placeholder="Select test date" />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <CustomInput isTextArea placeholder="Enter additional notes" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-blue-600">
            Submit Request
          </Button>
        </Form.Item>
      </Form>

      {/* Table for Displaying Requested Tests */}
      <h2 className="text-xl font-semibold mt-8 mb-4">Requested Tests</h2>
      <Table
        columns={columns}
        dataSource={requests}
        pagination={{ pageSize: 5 }}
        className="bg-white rounded-lg shadow-md"
      />
    </div>
  );
};

export default LaboratoryTestRequest;
