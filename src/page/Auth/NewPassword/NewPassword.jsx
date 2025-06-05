import changePasswordImage from "../../../assets/auth/changePassword.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Form } from "antd"; // Import Ant Design Form
import CustomInput from "../../../utils/CustomInput";
import CustomButton from "../../../utils/CustomButton";
import { toast } from "sonner";
import { useResetPasswordMutation } from "../../../redux/features/auth/authApi";

const NewPassword = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const submit = async (values) => {
    const { password } = values;
    try {
      const res = await resetPassword({
        email,
        password: password
      });
      if (res.error) {
        toast.error(res.error.data.message);
      }
      if (res.data) {
        toast.success(res.data.message);
        navigate("/auth");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full md:h-screen grid grid-cols-1 md:grid-cols-2 place-content-center px-5 py-10 gap-8 bg-white ">
      <div>
        <img
          src={changePasswordImage}
          className="w-full h-full mx-auto"
          alt="Change Password Illustration"
        />
      </div>
      <div className="mt-16 md:mt-[115px]">
        <div className="mb-5">
          <h1 className="font-semibold text-xl flex items-center gap-2">
            <Link to="/auth/otp">
              <IoIosArrowBack />
            </Link>
            Update Password
          </h1>
        </div>

        {/* Ant Design Form */}
        <Form
          layout="vertical"
          onFinish={submit} // Ant Design's form submission handler
          initialValues={{ password: "", confirmPassword: "" }} // Initial values
        >
          {/* CustomInput wrapped inside Form.Item for validation */}
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password"
              }
            ]}
          >
            <CustomInput
              className="bg-[#F1F9FF] border-[#77C4FE]"
              isPassword
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your password"
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                }
              })
            ]}
          >
            <CustomInput
              className="bg-[#F1F9FF] border-[#77C4FE]"
              isPassword
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>

          {/* CustomButton for submission */}
          <Form.Item>
            {/* <CustomButton loading={isLoading} border className="w-full">
              Update Password
            </CustomButton> */}
            <button
              type="submit"
              loading={isLoading}
              className="w-full bg-[#77C4FE] text-xl text-white p-2 rounded-md"
              border={true}
            >
              Update Password
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default NewPassword;
