import { Form } from "antd";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CustomInput from "../../../utils/CustomInput";
import { useAddFaqMutation } from "../../../redux/features/faq/faqApi";

const AddFaq = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [addFaq, { isLoading }] = useAddFaqMutation();

  const onFinish = async (values) => {
    try {
      const response = await addFaq({
        question: values.question,
        answer: values.answer
      }).unwrap();

      toast.success("FAQ added successfully");
      form.resetFields();
      navigate("/faq"); // Adjust this route as needed
    } catch (error) {
      console.error("Error adding FAQ:", error);
      toast.error(error.data?.message || "Failed to add FAQ");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/faq">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Add FAQ</h1>
      </div>

      {/* Form Section */}
      <Form form={form} layout="vertical" onFinish={onFinish} className="mt-5">
        {/* Question */}
        <Form.Item
          label="Question"
          name="question"
          rules={[{ required: true, message: "Please enter the question!" }]}
          className="w-[40%]"
        >
          <CustomInput 
            className="bg-[#D5EDFF] border-[#77C4FE]" 
            placeholder="Type your question" 
          />
        </Form.Item>

        {/* Answer */}
        <Form.Item
          label="Answer"
          name="answer"
          rules={[{ required: true, message: "Please enter the answer!" }]}
          className="w-[40%]"
        >
          <textarea
            className="w-full h-32 p-3 rounded-md border border-blue-300 bg-[#D5EDFF] text-gray-800 resize-none focus:outline-none focus:border-blue-400"
            placeholder="Write your answer here"
          />
        </Form.Item>

        {/* Submit Button */}
        <div className="flex justify-center mr-[10rem]">
          <button 
            type="submit"
            disabled={isLoading}
            className="mt-12 bg-[#77C4FE] px-14 py-3 flex items-center gap-5 text-white rounded-md border-none"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default AddFaq;