import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Modal } from "antd";
import { toast } from "sonner";
import { useDeleteTeamMemberMutation } from "../../../redux/features/product/teamApi";
import { BASE_URL } from "../../../utils/constants";

const TeamMemberCard = ({ product }) => {
  const [deleteTeamMember] = useDeleteTeamMemberMutation();

  const showDeleteConfirm = (memberId) => {
    Modal.confirm({
      title: "Delete Team Member",
      content: "Are you sure you want to delete this team member?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteTeamMember(memberId).unwrap();
          toast.success("Team member deleted successfully");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete team member");
        }
      },
    });
  };

  const imageUrl = product?.profileImage
    ? `${BASE_URL}${product.profileImage}`
    : "/default-profile.png";

  return (
    <div className="bg-[#D5EDFF] rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Image container with fixed size */}
      <div className="w-full h-48 bg-[#D5EDFF] flex items-center justify-center overflow-hidden">
        <img
          src={imageUrl}
          alt={product?.fullName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/default-profile.png";
          }}
        />
      </div>

      <div className="p-4">
        <Link to={`/detailInformation/${product.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:[#77C4FE] transition-colors">
            {product.fullName}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-3">
          {product.designation || "No description available"}
        </p>

        <div className="flex justify-between">
          <Link
            to={`/editInformation/${product.id}`}
            className="px-6 py-1 bg-[#77C4FE] text-white rounded hover:bg-[#77C4FE] transition"
          >
            Edit
          </Link>
          <button
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
    fullName: PropTypes.string.isRequired,
    designation: PropTypes.string,
    profileImage: PropTypes.string,
  }).isRequired,
};

export default TeamMemberCard;