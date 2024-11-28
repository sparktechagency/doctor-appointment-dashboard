import { Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaMinus, } from "react-icons/fa6";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { imageBaseUrl } from "../../../config/imageBaseUrl";
import {
    useGetProductByIdQuery,
    useUpdateProductMutation,
} from "../../../redux/features/product/productApi";
import CustomInput from "../../../utils/CustomInput";

const EditSubscriptions = () => {
  const [imageFile, setImageFile] = useState(null);
  const [ setImageUrl] = useState(null);
  const fileInputRef = useRef(null); // Reference to hidden file input
  const [updateItem, { isLoading }] = useUpdateProductMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams(); // Get the item id from the route
  const { data: product } = useGetProductByIdQuery(id, {
    skip: !id,
  });

  useEffect(() => {
    if (product) {
      // Pre-fill the form with the current item data
      form.setFieldsValue({
        productName: product?.name,
        price: product?.price,
        weight: product?.weight,
      });
      setImageUrl(`${imageBaseUrl}${product.image?.url}`); // Set existing image URL if available
    }
  }, [product, form]);

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
    const formdata = new FormData();
    formdata.append("name", values.productName);
    formdata.append("price", values.price);
    formdata.append("weight", values.weight);
    if (imageFile) {
      formdata.append("image", imageFile); // Add the new image if it's changed
    }

    try {
      const response = await updateItem({ id, formdata });
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        setImageFile(null);
        setImageUrl(null);
        form.resetFields();
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error updating item:", error);
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
        <h1 className="text-2xl font-semibold">Edit subscriptions</h1>
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
            <CustomInput placeholder="Type name" />
          </Form.Item>

          {/* Price */}
          <Form.Item
            label="Subscriptions Price"
            name="price"
            rules={[{ required: true, message: "Please enter the price!" }]}
            className="w-[90%]"
          >
            <CustomInput type="number" placeholder="Type price" />
          </Form.Item>
        

        {/* Weight */}
        <div className="flex">
          <Form.Item
            label=""
            name=""
            rules={[{ required: true, message: "Please enter the weight!" }]}
            className="w-[90%]"
          >
            <CustomInput type="" />
          </Form.Item>
          <div className="bg-secondary w-10 h-10 rounded-full ml-5 p-3 text-white">
          <FaMinus />
          </div>
        </div>

        {/* Submit Button */}
        <button loading={isLoading} border className="w-[90%] bg-secondary px-5 py-2 flex justify-center items-center gap-5 text-white rounded-md border-none">
         Add fields
        </button>


         {/* Submit Button */}
         <button loading={isLoading} border className="mt-12  bg-secondary px-5 py-2 flex  items-center gap-5 text-white rounded-md border-none">
         Update
        </button>
      </Form>
    </div>
  );
};

export default EditSubscriptions;
