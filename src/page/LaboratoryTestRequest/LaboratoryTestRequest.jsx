import { useState } from "react";
import { Form, Input, Button, Select, DatePicker, Table, Tag } from "antd";

const { TextArea } = Input;
const { Option } = Select;

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
          <Input placeholder="Enter patient name" />
        </Form.Item>

        <Form.Item
          label="Test Type"
          name="testType"
          rules={[{ required: true, message: "Please select the test type" }]}
        >
          <Select placeholder="Select test type">
            <Option value="Blood Test">Blood Test</Option>
            <Option value="X-Ray">X-Ray</Option>
            <Option value="MRI">MRI</Option>
            <Option value="CT Scan">CT Scan</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Test Date"
          name="testDate"
          rules={[{ required: true, message: "Please select the test date" }]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <TextArea rows={4} placeholder="Additional notes" />
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
