import { Form } from "antd";
import { useEffect, useState, useRef } from "react";
import { IoChevronBack, IoCameraOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUpdateUserMutation } from "../../../redux/features/profile/profileApi";
import CustomButton from "../../../utils/CustomButton";
import CustomInput from "../../../utils/CustomInput";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../../redux/features/auth/authSlice";

const EditPersonalInfo = () => {
  const { user } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [updateProfileInfo, { isLoading }] = useUpdateUserMutation();

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    user?.image ? `${imageBaseUrl}${user.image.url}` : null
  );
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageFile(file); // Store file to send on update
      setImageUrl(newImageUrl); // Show preview
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Open file dialog
    }
  };

  const onFinish = async (values) => {
    const formdata = new FormData();
    formdata.append("fullName", values.fullName);
    formdata.append("email", values.email);
    formdata.append("phone", values.phone);
    if (imageFile) {
      formdata.append("image", imageFile); // Add image if updated
    }

    try {
      const response = await updateProfileInfo(formdata);
      if (response.error) {
        toast.error(response.error.data.message);
      }
      if (response.data) {
        dispatch(updateUser({ user: response?.data?.attributes }));
        console.log(response.data);
        toast.success("Profile updated successfully!");
        navigate("/personal-info");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong while updating your profile.");
    }
  };

  console.log(`${imageBaseUrl}${user?.image?.url}`);
  return (
    <div className="w-full">
      {/* Back Button and Title */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center my-6">
          <Link to="/personal-info">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit Information</h1>
        </div>
      </div>

      {/* Profile Information */}
      <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Profile Picture */}
        <div className="flex justify-center items-center flex-col">
          <div onClick={handleDivClick} className="cursor-pointer mb-4 ">
            {imageUrl ? (
              <img
                className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-[#D5EDFF]"
                src={imageUrl}
                alt="Profile Preview"
              />
            ) : (
              <div className="bg-[#77C4FE] p-10 text-white flex flex-col items-center rounded-full ">
                <IoCameraOutline size={40} />
                <span className="text-sm">Upload Image</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <div className="mt-2 text-center">
            <span className="text-gray-500 text-sm">Profile</span>
            <div className="text-lg font-semibold uppercase mt-1 text-blue-600">
              {user?.role || "User Role"}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="w-full col-span-full md:col-span-9 space-y-6 mt-10"
        >
          {/* Full Name */}
          <Form.Item label="Full Name" name="fullName">
            <CustomInput placeholder="Enter your full name" />
          </Form.Item>

          {/* Email */}
          <Form.Item label="Email" name="email">
            <CustomInput placeholder="Enter your email" />
          </Form.Item>

          {/* Phone Number */}
          <Form.Item label="Phone Number" name="phone">
            <CustomInput type="number" placeholder="Enter your phone number" />
          </Form.Item>
          {/* Address */}
          <Form.Item label="Address" name="address">
            <CustomInput type="number" placeholder="Enter your phone number" />
          </Form.Item>

          {/* Submit Button */}
          <CustomButton loading={isLoading} className="w-full">
            Update Information
          </CustomButton>
        </Form>
      </div>
    </div>
  );
};

export default EditPersonalInfo;
