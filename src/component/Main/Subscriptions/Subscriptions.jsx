import { FaPlus } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";
import CategoriesCard from "./SubscriptionsCard";

const Subscriptions = () => {
  const dataSource = [
    {
      id: "1",
      name: "Free",
      amount: 0,
      subTitle1: "Unlimited product updates",
      subTitle2: "Unlimited product updates",
      subTitle3: "Unlimited product updates",
      subTitle4: "Appointment reminders",
      subTitle5: "Email and community support",
    },
    {
      id: "2",
      name: "Standard",
      amount: 1200,
      subTitle1: "Unlimited product updates",
      subTitle2: "Priority support",
      subTitle3: "Monthly consultations",
      subTitle4: "Appointment reminders",
      subTitle5: "Email and community support",
    },
    {
      id: "3",
      name: "Premium",
      amount: 1200,
      subTitle1: "Unlimited product updates",
      subTitle2: "VIP support",
      subTitle3: "Weekly consultations",
      subTitle4: "Appointment reminders",
      subTitle5: "Email and community support",
    },
  ];

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
        {dataSource?.map((item, index) => (
          <CategoriesCard key={item.i} index={index} item={item} />
        ))}
      </div>
    </>
  );
};

export default Subscriptions;
