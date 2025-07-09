import { Button, Form, message, Spin } from "antd";
import { useState, useEffect } from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { 
  useGetTermsConditionQuery,
  useCreateTermsConditionMutation,
  useUpdateTermsConditionMutation 
} from "../../redux/features/auth/authApi";

const EditTermsConditions = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // RTK Query hooks
  const { 
    data: termsData, 
    isLoading: isTermsLoading, 
    isError: isTermsError 
  } = useGetTermsConditionQuery();
  
  const [createTerms, { isLoading: isCreating }] = useCreateTermsConditionMutation();
  const [updateTerms, { isLoading: isUpdating }] = useUpdateTermsConditionMutation();

  // Set initial content when data loads
  useEffect(() => {
    if (termsData) {
      setContent(termsData.content || "<h1>Enter your 'Terms and Conditions' content here.</h1>");
      setIsEditing(!!termsData.content);
    }
  }, [termsData]);

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        // Update existing terms
        const response = await updateTerms({ content }).unwrap();
        if (response.code === 200) {
          message.success("Terms and Conditions updated successfully");
        } else {
          message.error(response.message || "Failed to update Terms and Conditions");
        }
      } else {
        // Create new terms
        const response = await createTerms({ content }).unwrap();
        if (response.code === 200) {
          message.success("Terms and Conditions created successfully");
          setIsEditing(true);
        } else {
          message.error(response.message || "Failed to create Terms and Conditions");
        }
      }
    } catch (error) {
      message.error(error.data?.message || "An error occurred");
      console.error("Submission error:", error);
    }
  };

  if (isTermsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isTermsError) {
    return <div>Error loading Terms and Conditions</div>;
  }

  return (
    <section className="w-full h-full min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">
            {isEditing ? "Edit" : "Create"} Terms and Conditions
          </h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg  text-end bg-[#F1F9FF]">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Terms and Conditions Content */}
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
               [ "image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline",],
                 
              
                 
              
               
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                
            
               
                  [{ indent: "-1" }, { indent: "+1" }],
               
                ],
              }}
              style={{ height: "400px", marginBottom: "50px",float:"left" }}
              theme="snow"
            />
          </Form.Item>

          {/* Update Button */}
          <div className="flex justify-end mt-8">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#77C4FE] text-white px-8 py-3 h-auto"
              loading={isCreating || isUpdating}
              disabled={!content}
            >
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditTermsConditions;