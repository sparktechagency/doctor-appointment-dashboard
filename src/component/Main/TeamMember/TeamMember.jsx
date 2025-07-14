import { FaPlus } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useGetAllTeamMembersQuery } from "../../../redux/features/product/teamApi";
import TeamMemberCard from "./TeamMemberCard";
import { useEffect } from "react";

const TeamMember = () => {
  const {
    data: teamMembers,
    isLoading,
    isError,
    error,
    refetch
  } = useGetAllTeamMembersQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  // Optional: Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 60000);
    return () => clearInterval(interval);
  }, [refetch]);

  let content = null;

  if (isLoading) {
    content = (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  } else if (isError) {
    content = (
      <div className="font-semibold text-rose-500 text-center py-5">
        {error?.data?.message || "Something went wrong"}
        <button 
          onClick={refetch}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  } else if (!teamMembers?.length) {
    content = (
      <div className="w-full h-full text-center py-5 flex flex-col justify-center items-center">
        <img
          src="/src/assets/nodata/not-data.svg"
          alt="No results"
          className="w-[256px] h-[256px] mb-4"
        />
        <h2 className="text-xl font-bold mb-2">No Team Members Found</h2>
        <button 
          onClick={refetch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>
    );
  } else {
    content = (
      <div className="max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((product) => (
            <TeamMemberCard 
              key={product.id} 
              product={product} 
              refetch={refetch}
            />
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
          <h1 className="text-2xl font-semibold">My Team Members</h1>
        </Link>
        <Link
          to="/addInformation"
          className="px-4 py-2 bg-[#77C4FE] text-white rounded flex items-center gap-2 hover:bg-secondary-dark transition-colors"
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