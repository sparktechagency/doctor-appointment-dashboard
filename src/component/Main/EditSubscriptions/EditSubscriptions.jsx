import { Form, Select } from "antd";
import { useEffect, useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CustomInput from "../../../utils/CustomInput";
import { 
  useUpdateSubscriptionMutation,
  useGetSubscriptionByIdQuery 
} from "../../../redux/features/subscription/subscriptionApi";


const { Option } = Select;

const EditSubscriptions = () => {
  const [features, setFeatures] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  // RTK Query hooks
  const { data: subscriptionData, isLoading: isSubscriptionLoading } = useGetSubscriptionByIdQuery(id);
  const [updateSubscription, { isLoading: isUpdating }] = useUpdateSubscriptionMutation();

  // Initialize form with subscription data
  useEffect(() => {
    if (subscriptionData) {
      const subscription = subscriptionData;
      form.setFieldsValue({
        title: subscription?.title,
        limitation: subscription?.limitation,
        stripePriceId: subscription?.stripePriceId,
        days: subscription?.days,
        amount: subscription?.amount,
      });
      setFeatures(subscription?.features || []);
    }
  }, [subscriptionData, form]);

  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  const handleUpdateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const onFinish = async (values) => {
    const subscriptionData = {
      ...values,
      features: features.filter(f => f.trim() !== ""), // Remove empty features
    };

    try {
      const response = await updateSubscription({ id, ...subscriptionData }).unwrap();
      toast.success(response.message);
      navigate("/subscriptions");
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error(error.data?.message || "Failed to update subscription");
    }
  };

  if (isSubscriptionLoading) {
    return <div>Loading subscription data...</div>;
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/subscriptions">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit Subscription</h1>
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

        {/* Duration (Days) */}
        <Form.Item
          label="Duration (Days)"
          name="days"
          rules={[{ required: true, message: "Please enter duration in days!" }]}
          className="w-[40%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] border-[#77C4FE]" 
            type="number" 
            placeholder="e.g. 30 for monthly" 
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
            step="0.01"
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
                onChange={(e) => handleUpdateFeature(index, e.target.value)}
                className="bg-[#D5EDFF] border-[#77C4FE] flex-1 mr-2"
                placeholder="Enter feature"
              />
              <div 
                className="bg-[#77C4FE] w-10 h-10 rounded-full p-3 text-white flex items-center justify-center cursor-pointer"
                onClick={() => handleRemoveFeature(index)}
              >
                <FaMinus/>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddFeature}
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
            disabled={isUpdating}
            className="mt-12 bg-[#77C4FE] px-14 py-3 flex items-center gap-5 text-white rounded-md border-none"
          >
            {isUpdating ? "Updating..." : "Update"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default EditSubscriptions;