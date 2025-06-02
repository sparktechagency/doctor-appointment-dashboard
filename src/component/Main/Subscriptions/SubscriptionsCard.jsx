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
    item.id === 1 || index === 0 ? 'bg-[#77C4FE] text-white' : 'bg-[#D5EDFF] text-[#32526B]'
  }`}
>
  {/* Image Handling with Centered Fallback */}
  <div className="mx-auto rounded-md flex justify-center items-center p-8">
    <p className="font-bold text-4xl">{name || "Unnamed Item"}</p>
  </div>

  <div className="bg-white w-full h-[1px] shadow-2xl"></div>

  {/* Item Name */}
  <div className="p-5 flex flex-col  justify-center space-y-2 text-center">
    <div className="flex items-center py-2 justify-center font-bold text-xl">
      <div className=" relative flex flex-col-1">
        <p className="text-[3.25rem] font-[3.25rem] p-2 mb-5"> {amount}</p>  
        <div className="flex flex-col ">
          
          <div className=" flex flex-col  justify-start items-start"><span className="">$ </span>
            <span className="text-md">Per Month</span> </div>
         
       
        </div>
     
      
      </div>
     
     
    </div>
    <h1 className="flex justify-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#6CB2E7]'} mr-3`} />
      {subTitle1}
    </h1>
    <h1 className="flex justify-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#6CB2E7]'} mr-3`} />
      {subTitle2}
    </h1>
    <h1 className="flex  justify-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-white' : 'text-[#6CB2E7]'} mr-3`} />
      {subTitle3}
    </h1>
    <h1 className="flex justify-center  py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-gray-300' : 'text-gray-300'} mr-3`} />
      {subTitle4}
    </h1>
    <h1 className="flex items-center justify-center py-1">
      <FaCheckCircle className={`${index === 0 ? 'text-gray-300' : 'text-gray-300'} mr-3`} />
      {subTitle5}
    </h1><div className="flex justify-center mx-auto items-center md:gap-5 mt-4 p-2">
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

  {/* Action Buttons */}
  
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
