import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import CategoriesCard from "./SubscriptionsCard";
import { useGetAllSubscriptionsQuery } from "../../../redux/features/subscription/subscriptionApi";

const Subscriptions = () => {
  const { data: subscriptions = [], isLoading  } = useGetAllSubscriptionsQuery();
  console.log(subscriptions)
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <div className="w-full flex justify-between items-center py-6 ">
        <h1 className="text-xl font-semibold flex items-center">
          <MdKeyboardArrowLeft /> Subscriptions
        </h1>
        <Link to={`/subscriptions/add-item`}>
          <button className="px-8 py-3 bg-secondary text-white flex justify-center items-center gap-1 rounded text-sm">
            <FaPlus />
            Add Subscriptions
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {subscriptions?.map((item, index) => (
          <CategoriesCard key={item.id} index={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default Subscriptions;
