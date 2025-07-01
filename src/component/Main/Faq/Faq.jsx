import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { useGetFaqsQuery, useDeleteFaqMutation } from "../../../redux/features/faq/faqApi";
import { Skeleton, message, Modal, Empty } from "antd";

const FaqPage = () => {
  const { data: faqData, isLoading, isError, refetch } = useGetFaqsQuery();
  const [deleteFaq] = useDeleteFaqMutation();

  const handleDelete = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this FAQ?',
      content: 'This action cannot be undone',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'No, cancel',
      onOk: async () => {
        try {
          await deleteFaq(id).unwrap();
          message.success('FAQ deleted successfully');
          refetch();
        } catch (error) {
          message.error('Failed to delete FAQ');
          console.error('Delete error:', error);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MdKeyboardArrowLeft className="text-2xl" />
            <Skeleton.Input active size="large" style={{ width: 100 }} />
          </div>
          <Skeleton.Button active shape="round" style={{ width: 120 }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <Skeleton active paragraph={{ rows: 4 }} key={item} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return <div>Error loading FAQs</div>;
  }

  const faqItems = faqData?.data?.attributes.results || [];

  return (
    <div className="w-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold flex items-center">
          <MdKeyboardArrowLeft className="text-2xl" /> FAQ
        </h1>
        <Link to="/faq/add-faq">
          <button className="px-8 py-3 bg-[#77C4FE] text-white flex justify-center items-center gap-1 rounded text-sm">
            <FaPlus />
            Add FAQ
          </button>
        </Link>
      </div>
      
      {faqItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {faqItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-gray-200 shadow-sm rounded-md hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 leading-tight pr-2">
                    {item.question}
                  </h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Link to={`/faq/edit-faq/${item.id}`}>
                      <button className="h-6 w-6 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded flex items-center justify-center">
                        <AiOutlineEdit />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 rounded flex items-center justify-center"
                    >
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {item.answer}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="text-gray-500">No FAQs available</span>
            }
          />
          <Link to="/faq/add-faq" className="mt-4">
            <button className="px-8 py-3 bg-[#77C4FE] text-white flex justify-center items-center gap-1 rounded text-sm">
              <FaPlus />
              Add Your First FAQ
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default FaqPage;