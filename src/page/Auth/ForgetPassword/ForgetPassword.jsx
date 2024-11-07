/* eslint-disable react/no-unescaped-entities */
import forgetPasswordImage from "../../../assets/auth/forget.png";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Form } from "antd";
import CustomInput from "../../../utils/CustomInput";
import { HiOutlineMail } from "react-icons/hi";
import CustomButton from "../../../utils/CustomButton";
import { useForgotPasswordMutation } from "../../../redux/features/auth/authApi";
import { toast } from "sonner";
import LogoImage from "../../../assets/auth/Logo.png";


const ForgetPassword = () => {
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submit = async (values) => {
    try {
      const res = await forgotPassword(values);
      if (res.error) {
        toast.error(res?.error?.data?.message);
        console.log(res.error);
      }
      if (res.data) {
        toast.success(res.data.message);
        navigate(`/auth/otp/${values?.email}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full md:h-screen grid grid-cols-1 md:grid-cols-2 place-content-center px-5 py-10 gap-8 bg-white ">
      <div>
        <img
          src={forgetPasswordImage}
          className="w-full h-full mx-auto"
          alt="Forgot Password Illustration"
        />
      </div>
      <div className="mt-16">
        <div className="mb-5 space-y-5">
        <img
          src={LogoImage}
          className="w-[136px] h-[129px] mx-auto mb-3"
          alt="Sign in illustration"
        />
          <h1 className="font-semibold text-2xl flex items-center gap-2">
            <Link to="/auth">
              <IoIosArrowBack />
            </Link>
            Forgot Password
          </h1>
          <h1>
            Enter the email address associated with your account. We'll send you
            an OTP to your email.
          </h1>
        </div>

        {/* Ant Design Form */}
        <Form
          layout="vertical"
          onFinish={submit} // Ant Design form submission
          initialValues={{ email: "" }} // Set initial form values
        >
          {/* CustomInput wrapped in Form.Item for validation */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <CustomInput icon={HiOutlineMail} placeholder="Email" />
          </Form.Item>

          {/* CustomButton for submit */}
          <Form.Item>
            <CustomButton
              loading={isLoading}
              border
              type="submit"
              className="w-full"
            >
              Send OTP
            </CustomButton>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
