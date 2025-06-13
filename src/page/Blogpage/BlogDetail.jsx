import { useParams } from "react-router-dom";
import { useGetSingleBlogQuery } from "../../redux/features/blog/blogApi";
import { Card, Tag, Space, Typography, Divider, Image, Avatar, Row, Col, Statistic } from "antd";
import { CalendarOutlined, EyeOutlined, LikeOutlined, CommentOutlined } from "@ant-design/icons";
import { format } from "date-fns";
import { BASE_URL } from "../../utils/constants";


const { Title, Paragraph, Text } = Typography;

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetSingleBlogQuery(slug);

  if (isLoading) return <div>loading</div>;
  if (isError) return <div>error</div>;

  const blog = data?.data?.attributes;



const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('https')) return path;
    return `${BASE_URL}${path}`;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        {/* Cover Image */}
        {blog.coverImage && (
          <div className="mb-6">
            <Image
              src={getFullImageUrl(blog.coverImage)}
              alt={blog.title}
              className="rounded-lg"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              preview={false}
            />
          </div>
        )}

        {/* Title */}
        <Title level={2} className="text-center mb-2">{blog.title}</Title>

        {/* Meta Information */}
        <div className="flex justify-center items-center mb-6">
          <Space size="large">
            <div className="flex items-center">
              <Avatar src={blog.author?.profileImage} size="small" className="mr-2" />
              <Text strong>{blog.author?.fullName}</Text>
            </div>
            <div className="flex items-center">
              <CalendarOutlined className="mr-2" />
              <Text>{format(new Date(blog.createdAt), 'MMMM dd, yyyy')}</Text>
            </div>
          </Space>
        </div>

        {/* Category and Tags */}
        <div className="flex justify-center mb-6">
          <Space size="middle">
            <Tag color="blue">{blog.category}</Tag>
            {blog.tags?.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Space>
        </div>

        {/* Stats */}
        <Row gutter={16} className="mb-6">
          <Col span={8}>
            <Statistic 
              title="Views" 
              value={blog.views} 
              prefix={<EyeOutlined />} 
              className="text-center"
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Likes" 
              value={blog.likes} 
              prefix={<LikeOutlined />} 
              className="text-center"
            />
          </Col>
          <Col span={8}>
            <Statistic 
              title="Comments" 
              value={blog.commentsCount} 
              prefix={<CommentOutlined />} 
              className="text-center"
            />
          </Col>
        </Row>

        <Divider />

        {/* Summary */}
        {blog.summary && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <Title level={4}>Summary</Title>
            <Paragraph>{blog.summary}</Paragraph>
          </div>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <Paragraph style={{ whiteSpace: 'pre-line' }}>{blog.content}</Paragraph>
        </div>

        {/* Status */}
        <Divider />
        <div className="flex justify-between items-center">
          <Tag color={blog.isPublished ? "green" : "orange"}>
            {blog.isPublished ? "Published" : "Draft"}
          </Tag>
          <Text type="secondary">Last updated: {format(new Date(blog.updatedAt || blog.createdAt), 'MMMM dd, yyyy HH:mm')}</Text>
        </div>
      </Card>
    </div>
  );
};

export default BlogDetailPage;