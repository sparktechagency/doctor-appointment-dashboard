import { Modal } from "antd";
import PropTypes from "prop-types";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useDeleteSubscriptionMutation } from "../../../redux/features/subscription/subscriptionApi";

const SubscriptionsCard = ({ subscription, index }) => {
  const [deleteSubscription] = useDeleteSubscriptionMutation();
  const { id, title, amount, features, limitation } = subscription;

  const showDeleteConfirm = (subscriptionId) => {
    Modal.confirm({
      title: "Delete Subscription",
      content: "Are you sure you want to delete this subscription?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      centered: true,
      onOk: async () => {
        try {
          await deleteSubscription(subscriptionId).unwrap();
          toast.success("Subscription deleted successfully");
        } catch (error) {
          toast.error(error?.data?.message || "Failed to delete subscription");
        }
      },
    });
  };

  // Determine pricing period text based on limitation
  const getPeriodText = () => {
    switch (limitation) {
      case 'monthly': return 'Per Month';
      case 'annual': return 'Per Year';
      case 'weekly': return 'Per Week';
      default: return 'Per Month';
    }
  };

  return (
    <div
      className={`w-1/4 mb-5  rounded-2xl border shadow-sm ${
        index === 0 ? 'bg-[#77C4FE] text-white' : 'bg-[#D5EDFF] text-[#32526B]'
      }`}
    >
      {/* Header Section */}
      <div className="mx-auto rounded-md flex justify-center items-center p-8">
        <p className="font-bold text-4xl">{title}</p>
      </div>

      <div className="bg-white w-full h-[1px] shadow-2xl"></div>

      {/* Content Section */}
      <div className="p-5 flex flex-col justify-center space-y-2 text-center">
        {/* Price Display */}
        <div className="flex items-center py-2 justify-center font-bold text-xl">
          <div className="relative flex">
            <p className="text-[3.25rem] p-2 mb-5">{amount}</p>  
            <div className="flex flex-col justify-start items-start">
                  <p className="">$</p>  
              <span className="text-md">{getPeriodText()}</span>
            </div>
          </div>
        </div>

      {/* Features List */}
{/* Features List */}
<div className="flex flex-col items-start mx-auto space-y-3">
  {features?.map((feature, i) => (
    <div key={i} className="flex ">
      <FaCheckCircle 
        className={`${
          index === 0 ? 'text-white' : 'text-[#6CB2E7]'
        } mr-3`} 
      />
      <span>{feature}</span>
    </div>
  ))}
</div>

        {/* Action Buttons */}
        <div className="flex justify-center mx-auto items-center gap-5 mt-4 p-2">
          <button
            onClick={() => showDeleteConfirm(id)}
            className={`px-6 py-2 border ${
              index === 0 ? 'border-white' : 'border-[#77C4FE]'
            } rounded text-sm`}
          >
            Delete
          </button>
          <Link to={`/subscriptions/edit/${id}`}>
            <button 
              className={`px-7 py-2 ${
                index === 0 ? 'bg-white text-[#77C4FE]' : 'bg-[#77C4FE] text-white'
              } rounded text-sm`}
            >
              Edit
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

SubscriptionsCard.propTypes = {
  subscription: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    limitation: PropTypes.string.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default SubscriptionsCard;