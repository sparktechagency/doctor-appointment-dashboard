import { Form, Input, Select, Button } from "antd";
import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAddSubscriptionMutation } from "../../../redux/features/subscription/subscriptionApi";
import CustomInput from "../../../utils/CustomInput";

const { Option } = Select;

const AddSubscriptions = () => {
  const [features, setFeatures] = useState([
    "500 free chat bot conversations",
    "Unlimited blog updates",
    "Health alerts by email",
    "24 hours support",
    "3 appointment bookings"
  ]);
  const [addSubscription, { isLoading }] = useAddSubscriptionMutation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const subscriptionData = {
      title: values.title,
      limitation: values.limitation,
      stripePriceId: values.stripePriceId,
      amount: values.amount,
      features: features
    };

    try {
      const response = await addSubscription(subscriptionData);
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success("Subscription added successfully");
        form.resetFields();
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast.error("Something went wrong");
    }
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/subscriptions">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Add new subscriptions</h1>
      </div>

      {/* Form Section */}
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-5">
        {/* Plan Title */}
        <Form.Item
          label="Subscription Name"
          name="title"
          rules={[{ required: true, message: "Please enter the name!" }]}
          className="w-[60%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] " 
            placeholder="Type name" 
          />
        </Form.Item>

        {/* Billing Cycle */}
        <Form.Item
          label="Billing Cycle"
          name="limitation"
          rules={[{ required: true, message: "Please select billing cycle!" }]}
          className="w-[60%]"
        >
          <Select 
            placeholder="Select billing cycle"
            className="bg-[#D5EDFF] "
          >
            <Option value="weekly">Weekly</Option>
            <Option value="monthly">Monthly</Option>
            <Option value="annual">Annual</Option>
          </Select>
        </Form.Item>

        {/* Stripe Price ID */}
        <Form.Item
          label="Stripe Price ID"
          name="stripePriceId"
          rules={[{ required: true, message: "Please enter Stripe Price ID!" }]}
          className="w-[60%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] " 
            placeholder="e.g. price_1RHHeV2KNq3x4TpgquEYM1mc" 
          />
        </Form.Item>

        {/* Amount */}
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount!" }]}
          className="w-[60%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] " 
            type="number" 
            placeholder="e.g. 39.99" 
          />
        </Form.Item>

        {/* Features */}
        <div className="w-[60%]">
          <label className="ant-form-item-label">Features</label>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mb-2">
              <CustomInput
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="bg-[#D5EDFF]  flex-1 mr-2"
                placeholder="Enter feature"
              />
              <div 
                className="bg-[#77C4FE] w-10 h-10 rounded-full p-3 ml-3 text-white flex items-center justify-center cursor-pointer"
                onClick={() => removeFeature(index)}
              >
                <FaMinus/>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="w-full bg-[#D5EDFF] border px-5 py-2 flex justify-center items-center gap-5 text-gray-800 rounded-md mt-2"
          >
       <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 21.6004C17.802 21.6004 22.1 17.3023 22.1 12.0004C22.1 6.69846 17.802 2.40039 12.5 2.40039C7.19809 2.40039 2.90002 6.69846 2.90002 12.0004C2.90002 17.3023 7.19809 21.6004 12.5 21.6004ZM13.7 8.40039C13.7 7.73765 13.1628 7.20039 12.5 7.20039C11.8373 7.20039 11.3 7.73765 11.3 8.40039V10.8004H8.90002C8.23728 10.8004 7.70002 11.3376 7.70002 12.0004C7.70002 12.6631 8.23728 13.2004 8.90002 13.2004H11.3V15.6004C11.3 16.2631 11.8373 16.8004 12.5 16.8004C13.1628 16.8004 13.7 16.2631 13.7 15.6004V13.2004H16.1C16.7628 13.2004 17.3 12.6631 17.3 12.0004C17.3 11.3376 16.7628 10.8004 16.1 10.8004H13.7V8.40039Z" fill="#77C4FE"/>
</svg>

            Add Feature
          </button>
        </div>

        {/* Submit Button */}
        <div className="float-end mr-[10rem]">
          <button 
            type="submit"
            loading={isLoading}
            className="mt-12 bg-[#77C4FE] px-14 py-3 flex items-center gap-5 text-white rounded-md border-none"
          >
            Update
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AddSubscriptions;