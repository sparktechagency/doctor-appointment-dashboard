import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import SubscriptionsCard from "./SubscriptionsCard";
import { useGetSubscriptionsQuery } from "../../../redux/features/subscription/subscriptionApi";

const Subscriptions = () => {
  const { data: subscriptions, isLoading, isError } = useGetSubscriptionsQuery();

  if (isLoading) return <div> loading </div>;
  if (isError) return <div>Error loading subscriptions</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold flex items-center">
          <Link to="/" className="mr-2">
            <MdKeyboardArrowLeft size={24} />
          </Link>
          Price
        </h1>
        <Link
          to="/subscriptions/add-item"
          className="px-4 py-2 bg-[#77c4fe] text-white rounded flex items-center gap-2 hover:bg-blue-600 transition"
        >
          <FaPlus />
          Add Subscription
        </Link>
      </div>

      {subscriptions?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {subscriptions.map((subscription, index) => (
            <SubscriptionsCard 
              key={subscription.id} 
              subscription={subscription} 
              index={index} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No subscriptions found</p>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;