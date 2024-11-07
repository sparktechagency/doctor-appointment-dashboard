/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDeleteProductMutation } from "../../../redux/features/product/productApi";
import { toast } from "sonner";
import { Modal } from "antd"; // Import Ant Design's Modal component

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
    item.id === 1 || index === 0 ? 'bg-[#77C4FE] text-white' : 'bg-[#D5EDFF] text-black'
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
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#77C4FE]'} mr-3`} />
      {subTitle1}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#77C4FE]'} mr-3`} />
      {subTitle2}
    </h1>
    <h1 className="flex items-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#77C4FE]'} mr-3`} />
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
      className={`px-3 py-2 border ${
        index === 0 ? 'border-white text-white' : 'border-[#77C4FE] text-[#77C4FE]'
      } rounded text-sm hover:bg-[#77C4FE] hover:text-white transition`}
    >
      Delete
    </button>
    <Link to={`/subscriptions/edit-item/${id}`}>
      <button className={`px-5 py-2 ${index === 0 ? 'bg-white text-[#77C4FE]' : 'bg-[#77C4FE] text-white'} rounded text-sm hover:bg-[#77C4FE] hover:text-white transition`}>
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
