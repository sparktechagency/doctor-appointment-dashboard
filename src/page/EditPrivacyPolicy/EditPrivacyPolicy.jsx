import { Form } from "antd";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Link } from "react-router-dom";
import CustomButton from "../../utils/CustomButton";

const EditPrivacyPolicy = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(
    "<h1>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at adipiscing proin et.</h1>"
  ); // Default content for the privacy policy

  const handleSubmit = () => {
    console.log("Updated Privacy Policy Content:", content);
    // Handle form submission, e.g., update the privacy policy in the backend
  };

  return (
    <section className="w-full h-full min-h-screen ">
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
      <div className="w-full p-6 rounded-lg shadow-md bg-secondary">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for Privacy Policy Content */}
          <Form.Item name="content" initialValue={content}>
            <ReactQuill
              value={content}
              onChange={(value) => setContent(value)}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }], // Header dropdown
                  [{ font: [] }], // Font options
                  [{ list: "ordered" }, { list: "bullet" }], // Ordered and bullet lists
                  ["bold", "italic", "underline", "strike"], // Formatting options
                  [{ align: [] }], // Text alignment
                  [{ color: [] }, { background: [] }], // Color and background
                  ["blockquote", "code-block"], // Blockquote and code block
                  ["link", "image", "video"], // Link, image, and video upload
                  [{ script: "sub" }, { script: "super" }], // Subscript and superscript
                  [{ indent: "-1" }, { indent: "+1" }], // Indent
                  ["clean"], // Remove formatting
                ],
              }}
              style={{ height: "300px" }} // Set the increased height
            />
          </Form.Item>

          {/* Update Button */}
          <div className="w-full flex justify-end mt-16">
            <button className="py-2 px-8 bg-primary text-white rounded-md"  >Update</button>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default EditPrivacyPolicy;
