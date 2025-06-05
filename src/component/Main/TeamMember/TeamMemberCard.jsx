import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { toast } from "sonner";
import { useDeleteTeamMemberMutation } from "../../../redux/features/product/teamApi";

const TeamMemberCard = ({ product }) => {
  const [deleteProduct] = useDeleteTeamMemberMutation();

  const showDeleteConfirm = (productId) => {
    Modal.confirm({
      title: "Delete Product",
      content: "Are you sure you want to delete this product?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteProduct(productId).unwrap();
          toast.success("Product deleted successfully");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete product");
        }
      },
    });
  };

const IMAGE_BASE_URL = 'http://10.0.60.18:6060'
  const imageUrl = product?.profileImage
    ? `${IMAGE_BASE_URL}${product.profileImage}`
    : `${IMAGE_BASE_URL}${product.profileImage}`;

console.log("product",product)
  return (
    <div className="bg-[#D5EDFF] rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="h-55 p-1 bg-[#D5EDFF] flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl }
          alt={product?.name}
          className="relative bg-[#D5EDFF] rounded-t-2xl overflow-hidden"
        />
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3">
          {product.description || "No description available"}
        </p>

        <div className="flex justify-between">
        
          <Link
            to={`/products/edit/${product.id}`}
            className="px-6 py-1 bg-[#77C4FE] text-white rounded hover:bg-primary-dark transition"
          >
            Edit
          </Link>  <button
            onClick={() => showDeleteConfirm(product.id)}
            className="px-6 py-1 border border-[#77C4FE] text-[#77C4FE] rounded hover:bg-red-50 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

TeamMemberCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.shape({
      url: PropTypes.string,
    }),
  }).isRequired,
};

export default TeamMemberCard;