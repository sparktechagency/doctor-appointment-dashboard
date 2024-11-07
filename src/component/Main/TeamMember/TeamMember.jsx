import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useGetAllProductsQuery } from "../../../redux/features/product/productApi";
import TeamMemberCard from "./TeamMemberCard";
import { IoChevronBack } from "react-icons/io5";

const TeamMember = () => {
  const dataSource = [
    {
      id: "1",
      name: "Blissful Retreat",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "2",
      name: "Soothing Spa",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "3",
      name: "Deluxe Wellness",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "4",
      name: "Herbal Healing",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "5",
      name: "Mindful Meditation",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "6",
      name: "Ultimate Relaxation",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "7",
      name: "Rejuvenation Escape",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "8",
      name: "Calm & Serenity",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "9",
      name: "Tranquil Moments",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
    {
      id: "10",
      name: "Peaceful Sanctuary",
      image: { url: "https://i.ibb.co/N6YSYxW/Rectangle-34624144.png" },
    },
  ];

  const {
    data: allItems,
    isLoading,
    isError,
    error,
  } = useGetAllProductsQuery();
  let content = null;
  if (isLoading) {
    content = <h1>Loading....</h1>;
  } else if (isError && error) {
    content = (
      <h3 className="font-semibold text-rose-500 text-center py-5">
        Something went wrong
      </h3>
    );
  } else if (!allItems?.length) {
    content = (
      <div className="w-full h-full text-center py-5   flex flex-col justify-center items-center">
        <img
          src="/src/assets/nodata/not-data.svg"
          alt="No results"
          className="w-[256px] mx-auto h-[256px] mb-4"
        />
        <h2 className="text-xl font-bold mb-2">No Items Found</h2>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 ">
        {dataSource?.map((item, i) => (
          <TeamMemberCard key={i} item={item} />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="w-full flex justify-between items-center py-6">
        <Link to={"/about"}>
          <h1 className="text-2xl font-semibold flex items-center">
            {" "}
            <IoChevronBack className="text-2xl" /> My Team Member
          </h1>
        </Link>
        <Link to={"#"}>
          <button className="px-8 py-3  text-white bg-[#77C4FE] flex justify-center items-center gap-1 rounded text-sm">
            <FaPlus />
            Add Member
          </button>
        </Link>
      </div>
      {content}
    </>
  );
};

export default TeamMember;
