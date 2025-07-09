import { IoChevronBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import { TbEdit } from "react-icons/tb";
import { FaPlus } from "react-icons/fa";
import CustomButton from "../../utils/CustomButton";
import { useGetAboutUsQuery } from "../../redux/features/auth/authApi";

const AboutUsPage = () => {
  const { data: aboutUsData, isLoading, isError } = useGetAboutUsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading about us information</div>;

  // Check if content exists (handle both array and object responses)
  const aboutUsContent = Array.isArray(aboutUsData?.data?.attributes)
    ? aboutUsData?.data?.attributes[0]?.content
    : aboutUsData?.data?.attributes?.content;

  const hasContent = aboutUsContent && aboutUsContent !== "<p></p>";

  return (
    <section className="w-full h-full min-h-screen">
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">About Us</h1>
        </div>
       
        
      </div>
      
      <div className="mt-4 p-4 bg-white rounded-lg ">
        {hasContent ? (
          <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
        ) : (
          <div className="text-gray-500 italic">No about us information available</div>
        )}
      </div>
      <div className="flex justify-end pt-5">
          <Link to="/settings/edit-about-us/11">
          {hasContent ? (
            <button className="flex items-center gap-1 justify-center px-6 py-2 m-4 rounded-md bg-[#77C4FE] text-white">
  
              <span>Update</span>
            </button>
          ) : (
            <button className="flex items-center gap-1 justify-center px-6 py-2 rounded-md bg-[#77C4FE] text-white">
        
              <span>Add</span>
            </button>
          )}
        </Link>
      </div>
    
    </section>
  );
};

export default AboutUsPage;