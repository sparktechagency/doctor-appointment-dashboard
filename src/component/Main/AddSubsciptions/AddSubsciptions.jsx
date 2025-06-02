import { Form } from "antd";
import { useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAddProductMutation } from "../../../redux/features/product/productApi";
import CustomInput from "../../../utils/CustomInput";
import { FaMinus } from "react-icons/fa";

const AddSubsciptions = () => {
  const [imageFile, setImageFile] = useState(null);
  const [setImageUrl] = useState(null);
  const fileInputRef = useRef(null); // To reference the hidden file input
  const [addItem, { isLoading }] = useAddProductMutation();
  const [form] = Form.useForm(); // Ant Design form instance
  const navigate = useNavigate();

  // Handle image change (preview the image)
  const handleImageChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImageUrl(newImageUrl); // Set the image URL for preview
    }
  };

  const onFinish = async (values) => {
    if (!imageFile) {
      toast.error("Please select an image");
      return;
    }
    const formdata = new FormData();
    formdata.append("name", values.productName);
    formdata.append("price", values.price);
    formdata.append("weight", values.weight);
    formdata.append("image", imageFile);

    try {
      const response = await addItem(formdata);
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        setImageFile(null);
        setImageUrl(null);
        form.resetFields();
        navigate("/items");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to={"/subscriptions"}>
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Add new subscriptions</h1>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }} // Hidden input
      />

      {/* Form Section */}
      {/* Form Section */}
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-5">
        {/* Product Name */}
        <Form.Item
          label="Subscriptions  Name"
          name="productName"
          rules={[
            { required: true, message: "Please enter the product name!" },
          ]}
          className="w-[90%]"
        >
          <CustomInput className="bg-[#D5EDFF] border-[#77C4FE]" placeholder="Type name" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          label="Subscriptions Price"
          name="price"
          rules={[{ required: true, message: "Please enter the price!" }]}
          className="w-[90%]"
        >
          <CustomInput className="bg-[#D5EDFF] border-[#77C4FE]" type="number" placeholder="Type price" />
        </Form.Item>

        {/* Weight */}
        <div className="flex">
          <Form.Item
            label=""
            name=""
            rules={[{ required: true, message: "Please enter the weight!" }]}
            className="w-[90%]"
          >
            <CustomInput className="bg-[#D5EDFF] border-[#77C4FE]" type="" />
          </Form.Item>
          <div className="bg-[#77C4FE] w-10 h-10 rounded-full ml-5 p-3 text-white">
            <FaMinus/>
          </div>
        </div>

        {/* Submit Button */}
        <button
          loading={isLoading}
          border
          className="w-[90%] bg-[#D5EDFF] border border-[#77C4FE] px-5 py-2 flex justify-center items-center gap-5 text-gray-800 rounded-md "
        >
          <FaPlus className="h-6 w-6 rounded-full bg-[#77C4FE] text-white" />  Add Field
        </button>
          <div className="float-end mr-[10rem]">
               {/* Submit Button */}
        <button loading={isLoading} border className="mt-12  bg-[#77C4FE] px-14 py-3 flex  items-center gap-5 text-white rounded-md border-none">
         Update
        </button>
          </div>
     
      </Form>
    </div>
  );
};

export default AddSubsciptions;
