import { Form } from "antd";
import { useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import CustomInput from "../../../utils/CustomInput";
import { 
  useUpdateFaqMutation,
  useGetFaqByIdQuery 
} from "../../../redux/features/faq/faqApi";

const EditFaq = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // RTK Query hooks
  const { data: response, isLoading: isFaqLoading, isError } = useGetFaqByIdQuery(id);
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();

  // Extract FAQ data from response
  const faq = response?.[0];
console.log(faq)
  // Initialize form with FAQ data
  useEffect(() => {
    if (faq) {
      form.setFieldsValue({
        question: faq.question,
        answer: faq.answer,
      });
    }
  }, [faq, form]);

  const onFinish = async (values) => {
    try {
      const response = await updateFaq({
        id,
        ...values
      }).unwrap();

      toast.success(response.message || "FAQ updated successfully");
      navigate("/faq");
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error(error.data?.message || "Failed to update FAQ");
    }
  };

  if (isFaqLoading) {
    return <div className="w-full p-6">Loading FAQ data...</div>;
  }

  if (isError) {
    return <div className="w-full p-6">Error loading FAQ data</div>;
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex gap-4 items-center my-6">
        <Link to="/faq">
          <IoChevronBack className="size-6" />
        </Link>
        <h1 className="text-2xl font-semibold">Edit FAQ</h1>
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

export default EditFaq;