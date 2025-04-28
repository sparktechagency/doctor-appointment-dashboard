import { Form } from "antd";

import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import CustomInput from "../../../utils/CustomInput";
import { useGetAllSubscriptionsQuery, useUpdateSubscriptionMutation } from "../../../redux/features/subscription/subscriptionApi";

const EditSubscriptions = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const  {id}  = useParams();
  // console.log("the post id is",id)
  const { data: subscriptions = [], refetch } = useGetAllSubscriptionsQuery();
  const [updateSubscription,{isLoading }] = useUpdateSubscriptionMutation();
  const subscription = subscriptions.find((item) => item.id === id);
  // console.log(subscription)
  // Prefill form when subscription is found
  if (subscription && !form.getFieldValue("title")) {
    form.setFieldsValue({
      title: subscription.title,
      limitation: subscription.limitation,
      stripePriceId: subscription.stripePriceId,
      days: subscription.days,
      amount: subscription.amount,
      features: subscription.features?.join(", "), // join features array as comma separated
    });
  }

  const onFinish = async (values) => {
    const payload = {
      title: values.title,
      limitation: values.limitation,
      stripePriceId: values.stripePriceId,
      days: Number(values.days),
      amount: Number(values.amount),
      features: values.features?.split(",").map((item) => item.trim()),
    };

    try {
      const response = await updateSubscription({ id, payload });
      // console.log(payload)
      await refetch()
      if (response.error) {
        toast.error(response.error.data.message);
      } else {
        toast.success(response.data.message);
        form.resetFields();
        await refetch();
        navigate("/subscriptions");
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
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
        <h1 className="text-2xl font-semibold">Edit Subscription</h1>
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
            placeholder="Comma-separated features (e.g. Feature1, Feature2)"
          />
        </Form.Item>

        <button
        type="submit"
          disabled={isLoading}
          className="w-[90%] mt-5 bg-secondary px-5 py-2 flex justify-center items-center gap-5 text-white rounded-md border-none"
        >
          {isLoading ? "Updating..." : "Update Subscription"}
        </button>
      </Form>
    </div>
  );
};

export default EditSubscriptions;
