import { Form } from "antd";

import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import CustomInput from "../../../utils/CustomInput";
import {
  useCreateSubscriptionMutation,
  useGetAllSubscriptionsQuery,
} from "../../../redux/features/subscription/subscriptionApi";

const AddSubsciptions = () => {
  const [createSubscription, { isLoading }] = useCreateSubscriptionMutation();
  const { refetch } = useGetAllSubscriptionsQuery();

  const [form] = Form.useForm(); // Ant Design form instance
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  console.log(token);

  const onFinish = async (values) => {
    const payload = {
      title: values.title,
      limitation: values.limitation,
      stripePriceId: values.stripePriceId,
      days: Number(values.days),
      amount: Number(values.amount),
      features: values.features?.split(",").map((item) => item.trim()), // comma-separated features input
    };

    try {
      const response = await createSubscription(payload);

      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        form.resetFields();
        await refetch();
        navigate("/subscriptions"); // Go back to subscriptions list
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/subscriptions">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Add new subscription</h1>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-5">
        <Form.Item
          label="Subscription Title"
          name="title"
          rules={[{ required: true, message: "Please enter title!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Type title"
          />
        </Form.Item>

        <Form.Item
          label="Limitation"
          name="limitation"
          rules={[{ required: true, message: "Please enter limitation!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Type limitation (e.g. monthly)"
          />
        </Form.Item>

        <Form.Item
          label="Stripe Price ID"
          name="stripePriceId"
          rules={[{ required: true, message: "Please enter Stripe Price ID!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Type stripe price ID"
          />
        </Form.Item>

        <Form.Item
          label="Days"
          name="days"
          rules={[{ required: true, message: "Please enter days!" }]}
          className="w-[90%]"
        >
          <CustomInput
            type="number"
            className="bg-white border-secondary"
            placeholder="Number of days"
          />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter amount!" }]}
          className="w-[90%]"
        >
          <CustomInput
            type="number"
            className="bg-white border-secondary"
            placeholder="Type amount"
          />
        </Form.Item>

        <Form.Item
          label="Features"
          name="features"
          rules={[{ required: true, message: "Please enter features!" }]}
          className="w-[90%]"
        >
          <CustomInput
            className="bg-white border-secondary"
            placeholder="Comma-separated features (e.g. Feature1, Feature2, Feature3)"
          />
        </Form.Item>

        <button
          disabled={isLoading}
          className="w-[90%] mt-5 bg-secondary px-5 py-2 flex justify-center items-center gap-5 text-white rounded-md border-none"
        >
          {isLoading ? "Adding..." : "Add Subscription"}
        </button>
      </Form>
    </div>
  );
};

export default AddSubsciptions;
