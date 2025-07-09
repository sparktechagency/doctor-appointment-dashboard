import { Button, Form, Input, Modal, message, Card } from "antd";
import { HiOutlineLockClosed } from "react-icons/hi";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useChangePasswordMutation } from "../../../redux/features/auth/authApi";
import { useState } from "react";
const PasswordSetting = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // RTK Query mutation for changing password
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    try {
      const response = await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      if (response.code === 200) {
        message.success(response.message || "Password changed successfully");
        form.resetFields();
      } else {
        message.error(response.message || "Failed to change password");
      }
    } catch (error) {
      message.error(error.data?.message || "Failed to change password");
    }
  };

  const handleForgetPassword = async (values) => {
    console.log(values);
    // Implement your forgot password logic here
  };

  return (
    <div className="w-full px-4 py-6">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Change Password</h1>
        </div>
      </div>

      {/* Password Change Form */}
      <div className="w-full max-w-4xl mx-auto">
        <div className="">
          <Form
            form={form}
            name="passwordForm"
            autoComplete="off"
            layout="vertical"
            className="space-y-6"
            onFinish={handleChangePassword}
          >
            <div className="space-y-6">
              <Form.Item
                name="oldPassword"
                label={<span className="text-lg font-medium">Current Password</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input your current password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<HiOutlineLockClosed className="text-gray-400 rounded-none" />}
                  placeholder="Enter your current password"
                  className="py-3 px-4 rounded-none"
                />
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={<span className="text-lg font-medium">New Password</span>}
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<HiOutlineLockClosed className="text-gray-400" />}
                  placeholder="Enter your new password"
                  className="py-3 px-4 rounded-none"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                label={<span className="text-lg font-medium">Re-enter new password</span>}
                dependencies={["newPassword"]}
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("The two passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<HiOutlineLockClosed className="text-gray-400" />}
                  placeholder="Enter your password"
                  className="py-3 px-4 rounded-none"
                />
              </Form.Item>

              <div className="flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Forgot Password?
                </button>

              
              </div>  <div className="flex gap-4">
                  
                  <Button
                    type="primary" 
                    htmlType="submit"
                    className="px-6 h-10 w-full bg-[#77C4FE]"
                    loading={isLoading}
                  >
                    Update Password
                  </Button>
                </div>
            </div>
          </Form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Card>
          <Form
            layout="vertical"
            className="space-y-6 mt-6"
            onFinish={handleForgetPassword}
          >
            <Form.Item
              name="email"
              label={<span className="text-lg font-medium">Email</span>}
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input a valid email!",
                },
              ]}
            >
              <Input size="large" placeholder="Enter your email" className="py-3 px-4" />
            </Form.Item>

            <Form.Item className="flex justify-end">
              <Button
                type="primary"
                htmlType="submit"
                className="px-6 h-10"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </div>
  );
};

export default PasswordSetting;