import { useState } from "react";
import { Form, Button, Table, Tag, Space, Input, Select, Popconfirm, message } from "antd";
import { useListBlogQuery, useDeleteBlogMutation } from "../../redux/features/blog/blogApi";
import CreateBlogPage from "./CreateBlog";

const { Search } = Input;
const { Option } = Select;

const BlogPage = () => {
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    sortBy: "createdAt:desc"
  });
  const [searchParams, setSearchParams] = useState({});
  const [deleteBlog] = useDeleteBlogMutation();

  // Fetch blog data with pagination and search params
  const { data: blogData, isLoading, isFetching } = useListBlogQuery({
    page: pagination.current,
    limit: pagination.pageSize,
    sortBy: pagination.sortBy,
    ...searchParams
  });

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      message.success('Blog deleted successfully');
    } catch (err) {
      message.error('Failed to delete blog');
      console.error('Error deleting blog:', err);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({
      ...pagination,
      sortBy: sorter.field 
        ? `${sorter.field}:${sorter.order === 'ascend' ? 'asc' : 'desc'}`
        : 'createdAt:desc'
    });
  };

  const handleSearch = (value) => {
    setSearchParams({
      ...searchParams,
      search: value
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const handleCategoryFilter = (value) => {
    setSearchParams({
      ...searchParams,
      category: value
    });
    setPagination({
      ...pagination,
      current: 1
    });
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: true,
      render: (text, record) => (
        <a href={`/blogs/${record.slug}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      )
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      filters: [
        { text: 'Programming', value: 'Programming' },
        { text: 'Technology', value: 'Technology' },
        { text: 'Design', value: 'Design' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <Space size="small">
          {tags?.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Space>
      )
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "status",
      render: (isPublished) => (
        <Tag color={isPublished ? "green" : "orange"}>
          {isPublished ? "Published" : "Draft"}
        </Tag>
      )
    },
    {
      title: "Views",
      dataIndex: "views",
      key: "views",
      sorter: true,
    },
    {
      title: "Likes",
      dataIndex: "likes",
      key: "likes",
      sorter: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: true,
      render: (date) => new Date(date).toLocaleDateString()
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure to delete this blog?"
            onConfirm={() => handleDelete(record.slug)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
           
        </Space>
      ),
    }
  ];

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Blog Management</h2>
      </div>
      <CreateBlogPage />
      
      <div className="flex gap-4 mb-6">
        <Search
          placeholder="Search blogs..."
          allowClear
          enterButton
          onSearch={handleSearch}
          className="w-1/2"
        />
        <Select
          placeholder="Filter by category"
          allowClear
          onChange={handleCategoryFilter}
          className="w-1/4"
        >
          <Option value="Programming">Programming</Option>
          <Option value="Technology">Technology</Option>
          <Option value="Design">Design</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={blogData?.data?.attributes?.results || []}
        loading={isLoading || isFetching}
        onChange={handleTableChange}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: blogData?.data?.attributes?.totalResults || 0,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        rowKey="id"
        className="bg-white rounded-lg shadow-md"
      />
    </div>
  );
};

export default BlogPage;