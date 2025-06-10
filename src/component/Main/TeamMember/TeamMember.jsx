import { FaPlus } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useGetAllTeamMembersQuery } from "../../../redux/features/product/teamApi";
import TeamMemberCard from "./TeamMemberCard";


const TeamMember = () => {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useGetAllTeamMembersQuery();

  let content = null;

  if (isLoading) {
    content = <div>loading</div>;
  } else if (isError) {
    content = (
      <div className="font-semibold text-rose-500 text-center py-5">
        {error?.data?.message || "Something went wrong"}
      </div>
    );
  } else if (!products?.length) {
    content = (
      <div className="w-full h-full text-center py-5 flex flex-col justify-center items-center">
        <img
          src="/src/assets/nodata/not-data.svg"
          alt="No results"
          className="w-[256px] h-[256px] mb-4"
        />
        <h2 className="text-xl font-bold mb-2">No Products Found</h2>
      </div>
    );
  } else {
    content = (
            <div className="max-w-6xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <TeamMemberCard key={product.id} product={product} />
        ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Link to="/about" className="flex items-center gap-2">
          <IoChevronBack className="text-2xl" />
          <h1 className="text-2xl font-semibold">My Team Member</h1>
        </Link>
        <Link
          to="/addInformation"
          className="px-4 py-2 bg-secondary text-white rounded flex items-center gap-2"
        >
          <FaPlus />
          <span>Add Member</span>
        </Link>
      </div>
      {content}
    </div>
  );
};

export default TeamMember;