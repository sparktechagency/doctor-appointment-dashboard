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
          className="w-[40%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] border-[#77C4FE]" 
            placeholder="Type name" 
          />
        </Form.Item>

        {/* Billing Cycle */}
        <Form.Item
          label="Billing Cycle"
          name="limitation"
          rules={[{ required: true, message: "Please select billing cycle!" }]}
          className="w-[40%]"
        >
          <Select 
            placeholder="Select billing cycle"
            className="bg-[#D5EDFF] border-[#77C4FE]"
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
          className="w-[40%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] border-[#77C4FE]" 
            placeholder="e.g. price_1RHHeV2KNq3x4TpgquEYM1mc" 
          />
        </Form.Item>

        {/* Amount */}
        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter the amount!" }]}
          className="w-[40%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] border-[#77C4FE]" 
            type="number" 
            placeholder="e.g. 39.99" 
          />
        </Form.Item>

        {/* Features */}
        <div className="w-[40%]">
          <label className="ant-form-item-label">Features</label>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center mb-2">
              <CustomInput
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="bg-[#D5EDFF] border-[#77C4FE] flex-1 mr-2"
                placeholder="Enter feature"
              />
              <div 
                className="bg-[#77C4FE] w-10 h-10 rounded-full p-3 text-white flex items-center justify-center cursor-pointer"
                onClick={() => removeFeature(index)}
              >
                <FaMinus/>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="w-full bg-[#D5EDFF] border border-[#77C4FE] px-5 py-2 flex justify-center items-center gap-5 text-gray-800 rounded-md mt-2"
          >
            <FaPlus className="h-6 w-6 rounded-full bg-[#77C4FE] text-white" />
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