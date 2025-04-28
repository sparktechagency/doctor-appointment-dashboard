import PropTypes from "prop-types";
import { Link } from "react-router-dom";
// import { imageBaseUrl } from "../../../config/imageBaseUrl";
import { Modal } from "antd"; // Import Ant Design's Modal component
import { toast } from "sonner";
import { useDeleteProductMutation } from "../../../redux/features/product/productApi";
import { getBaseURL } from "../../../redux/baseApi/baseURL";
import { useDeleteMemberMutation } from "../../../redux/features/teams/teamsApi";


const TeamMemberCard = ({ item }) => {
  const [deleteMember] = useDeleteMemberMutation();
  const { id, fullName,  profileImage,designation} = item;
// console.log("item card is called",item)

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
    
    console.log("delete team is called")
    try {
      const res = await deleteMember(productId);
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
    <div className="w-full rounded-lg border shadow-sm p-2  bg-gray-200">
      {/* Image Handling with Centered Fallback */}
      <div className="mx-auto flex justify-center items-center overflow-hidden w-[100%] h-[230px] rounded-lg bg-gray-100">
        <img
          src={`${getBaseURL()}${profileImage}`}
          alt={name || "Product Image"}
          className=" w-full h-full"
        />
      </div>

      {/* Item Name */}
      <div className="mt-4 space-y-1 ">
        <h1 className="font-semibold text-lg">
          {fullName || "Unnamed Item"}
        </h1>
        <h1 className="text-gray-800">
       { designation||"Board-certified Psychiatrist"}
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-3">
        <button
          onClick={() => showDeleteConfirm(id)}
          className="px-4 py-2 border border-primary text-primary rounded text-sm transition duration-200"
        >
          Delete
        </button>

        <Link to={`/teammember/edit-item/${id}`}>
          <button className="px-4 py-2 bg-primary text-white rounded text-sm transition duration-200">
            Edit
          </button>
        </Link>
      </div>

    </div>
  );
};

// PropTypes for type checking
TeamMemberCard.propTypes = {
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

export default TeamMemberCard;