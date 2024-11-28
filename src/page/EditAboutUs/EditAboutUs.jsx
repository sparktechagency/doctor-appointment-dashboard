import { Button, Form } from "antd";
import { useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import ReactQuill from "react-quill"; // Import React Quill
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import { Link } from "react-router-dom";

const EditAboutUs = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState(
    "<p>Enter your 'About Us' content here.</p>"
  ); // Default content for the About Us section

  const handleSubmit = () => {
    console.log("Updated About Us Content:", content);
    // Handle form submission, e.g., update the about us section in the backend
  };

  return (
    <section className="w-full h-full min-h-screen ">
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
      <div className="w-full p-6 rounded-lg shadow-md bg-secondary">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          {/* React Quill for About Us Content */}
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
          <div className="flex justify-end mt-16">
            <Button
              type="primary"
              htmlType="submit"
              className="bg-[#0d28e0] text-white px-5 py-2 rounded-md"
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
