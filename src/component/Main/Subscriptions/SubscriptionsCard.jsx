/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Modal } from "antd"; // Import Ant Design's Modal component
import PropTypes from "prop-types";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteProductMutation } from "../../../redux/features/product/productApi";

const SubscriptionsCard = ({ item, index }) => {
  const [deleteProduct] = useDeleteProductMutation();
  const { id, name, subTitle5,  amount, subTitle4, subTitle3, subTitle2, subTitle1} = item;

  // Show confirmation modal
  const showDeleteConfirm = (productId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true, // Centers the modal
      onOk: () => handleDelete(productId), // Delete item if confirmed
    });
  };

  const handleDelete = async (productId) => {
    try {
      const res = await deleteProduct(productId);
      if (res.error) {
        toast.error("Failed to delete product");
        return;
      }
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
  className={`w-full rounded-lg border shadow-sm ${
    item.id === 1 || index === 0 ? 'bg-primary text-white' : 'bg-primary text-white'
  }`}
>
  {/* Image Handling with Centered Fallback */}
  <div className="mx-auto rounded-md flex justify-center items-center p-8">
    <p className="font-bold text-xl">{name || "Unnamed Item"}</p>
  </div>

  <div className="bg-gray-500 w-full h-[1px] shadow-2xl"></div>

  {/* Item Name */}
  <div className="p-5 space-y-2 text-center">
    <div className="flex items-center py-2 justify-center font-bold text-xl">
      {amount}$ <br />Per Month
    </div>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-primary'} mr-3`} />
      {subTitle1}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-primary'} mr-3`} />
      {subTitle2}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-primary'} mr-3`} />
      {subTitle3}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-gray-300' : 'text-gray-300'} mr-3`} />
      {subTitle4}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-gray-300' : 'text-gray-300'} mr-3`} />
      {subTitle5}
    </h1>
  </div>

  {/* Action Buttons */}
  <div className="flex justify-between items-center md:gap-5 mt-4 p-2">
    <button
      onClick={() => showDeleteConfirm(id)}
      className={`px-6 py-2 border border-white rounded text-sm `}
    >
      Delete
    </button>
    <Link to={`/subscriptions/edit-item/${id}`}>
      <button className={`px-7 py-2 bg-white rounded text-sm text-primary`}>
        Edit
      </button>
    </Link>
  </div>
</div>

  );
};

// PropTypes for type checking
SubscriptionsCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
    weight: PropTypes.number,
  }).isRequired,
};

export default SubscriptionsCard;
