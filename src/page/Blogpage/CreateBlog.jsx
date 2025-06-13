import { useState } from "react";
import { Form, Button, message, Upload, Input, Select, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateBlogMutation } from "../../redux/features/blog/blogApi";

const { TextArea } = Input;
const { Option } = Select;

const CreateBlogPage = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [createBlog, { isLoading }] = useCreateBlogMutation();

  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();
      
      // Append all form fields to FormData
      formData.append('title', values.title);
      formData.append('summary', values.summary);
      formData.append('content', values.content);
      formData.append('category', values.category);
      formData.append('isPublished', values.isPublished);
      
      // Append tags as JSON string if backend expects it that way
      if (values.tags && values.tags.length > 0) {
        formData.append('tags', JSON.stringify(values.tags));
      }
      
      // Alternative: Append tags as array (choose one approach based on backend requirements)
      // values.tags.forEach(tag => formData.append('tags[]', tag));
      
      // Append cover image if exists
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('coverImage', fileList[0].originFileObj);
      }

      // Submit form data
      const response = await createBlog(formData).unwrap();
      
      if (response.code === 201) {
        message.success('Blog created successfully!');
        form.resetFields();
        setFileList([]);
      } else {
        message.error(response.message || 'Failed to create blog');
      }
    } catch (err) {
      message.error(err.data?.message || 'Failed to create blog');
      console.error('Error creating blog:', err);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false;
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">Create New Blog Post</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        className="bg-white p-4 rounded-lg shadow-md"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter the blog title" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          label="Summary"
          name="summary"
          rules={[{ required: true, message: "Please enter a summary" }]}
        >
          <TextArea rows={3} placeholder="Enter brief summary" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please enter the content" }]}
        >
          <TextArea rows={8} placeholder="Write your blog content here" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select category">
            <Option value="Programming">Programming</Option>
            <Option value="Health">Health</Option>
            <Option value="Technology">Technology</Option>
            <Option value="Lifestyle">Lifestyle</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tags"
          name="tags"
          rules={[{ required: true, message: "Please select at least one tag" }]}
        >
          <Select
            mode="tags"
            placeholder="Select tags or type to add new"
            tokenSeparators={[',']}
            // Add this to ensure proper tag formatting
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Option value="javascript">JavaScript</Option>
            <Option value="react">React</Option>
            <Option value="health">Health</Option>
            <Option value="programming">Programming</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Cover Image"
          name="coverImage"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Maximum file size: 5MB"
        >
          <Upload
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            fileList={fileList}
            maxCount={1}
            listType="picture"
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Upload Cover Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Publish Immediately"
          name="isPublished"
          valuePropName="checked"
          initialValue={false}
        >
          <Checkbox>Publish this blog immediately</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="large"
          >
            {isLoading ? 'Publishing...' : 'Publish Blog'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateBlogPage;