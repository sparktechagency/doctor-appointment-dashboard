import { Button, Form, message } from "antd";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { useGetAboutUsQuery, useUpdateAboutUsMutation } from "../../redux/features/auth/authApi";

const EditAboutUs = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("<p>Enter your 'About Us' content here.</p>");
  
  // Use the query hook to fetch existing about us content
  const { data: aboutUsData, isLoading, isError } = useGetAboutUsQuery();
  // Use the mutation hook for updating
  const [updateAboutUs, { isLoading: isUpdating }] = useUpdateAboutUsMutation();

  // Set initial content when data is loaded
  useEffect(() => {
    if (aboutUsData?.data?.attributes?.content) {
      setContent(aboutUsData.data.attributes.content);
    }
  }, [aboutUsData]);

  const handleSubmit = async () => {
    try {
      const response = await updateAboutUs({ content }).unwrap();
      message.success(response.message || "About Us updated successfully");
    } catch (err) {
      message.error(err.data?.message || "Failed to update About Us");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading About Us content</div>;

  return (
    <section className="w-full h-full min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Edit About Us</h1>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full p-6 rounded-lg text-end bg-[#F1F9FF]">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for About Us Content */}
          <Form.Item name="content">
            <ReactQuill
              value={content}
              onChange={setContent}
              modules={{
                toolbar: [
                  ["image"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline"],
                  [{ align: [] }],
                  [{ color: [] }, { background: [] }],
                  [{ indent: "-1" }, { indent: "+1" }],
                ],
              }}
              style={{ height: "400px", marginBottom: "50px", float: "left" }}
              theme="snow"
            />
          </Form.Item>

          {/* Update Button */}
          <div className="flex justify-end mt-16">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#0d28e0] text-white px-5 py-2 rounded-md"
              loading={isUpdating}
              disabled={isUpdating}
            >
              Update
            </Button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditAboutUs;