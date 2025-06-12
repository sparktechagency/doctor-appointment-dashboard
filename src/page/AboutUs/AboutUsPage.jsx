import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import CustomButton from "../../utils/CustomButton";
import { useGetAboutUsQuery } from "../../redux/features/auth/authApi";
const AboutUsPage = () => {
  const { data: aboutUsData, isLoading, isError } = useGetAboutUsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading about us information</div>;

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
        <Link to={"/settings/edit-about-us/11"}>
          <button className="flex items-center justify-center p-2 rounded-md bg-secondary text-white">
            <TbEdit className="size-5" />
            <span>Edit</span>
          </button>
        </Link>
      </div>
      <div>
        <h1>{aboutUsData?.content || "No about us information available"}</h1>
      </div>
    </section>
  );
};

export default AboutUsPage