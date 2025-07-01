import { Form, message } from "antd";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { useAddPrivacyPolicyMutation, useGetPrivacyPolicyQuery } from "../../redux/features/auth/authApi";

const AddPrivacyPolicy = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [addPrivacyPolicy] = useAddPrivacyPolicyMutation();
  const { data: privacyPolicyData, isLoading, isError } = useGetPrivacyPolicyQuery();

  useEffect(() => {
    if (privacyPolicyData) {
      // Remove <p> tags from existing content
      const rawContent = privacyPolicyData.content
      console.log(rawContent)
        ?.replace(/<p>/g, '')
        ?.replace(/<\/p>/g, '') || "";
      setContent(rawContent);
      form.setFieldsValue({ content: rawContent });
    }
  }, [privacyPolicyData, form]);

  const handleSubmit = async () => {
    try {
      await addPrivacyPolicy({ content }).unwrap();
      message.success("Privacy Policy updated successfully");
    } catch (error) {
      message.error("Failed to update Privacy Policy");
      console.error("Update error:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading Privacy Policy</div>;

  return (
    <section className="w-full h-full min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg shadow-md bg-white">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Privacy Policy Content */}
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  [{ font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  ["blockquote", "code-block"],
                  ["link", "image", "video"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["clean"],
                ],
              }}
              style={{ height: "300px" }}
            />
          </Form.Item>

          {/* Update Button */}
          <div className="w-full flex justify-end mt-16">
            <button 
              type="submit" 
              className="py-2 px-8 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              {privacyPolicyData ? "Update" : "Add"}
            </button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default AddPrivacyPolicy;