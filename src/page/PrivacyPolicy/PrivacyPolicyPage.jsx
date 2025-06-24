import { IoChevronBack } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useGetPrivacyPolicyQuery } from "../../redux/features/auth/authApi";
import { Spin, Alert } from "antd";

const PrivacyPolicyPage = () => {
  const { data, isLoading, isError } = useGetPrivacyPolicyQuery();

  // Extract the privacy policy content from the API response
  const policyContent = data?.data?.attributes?.[0]?.content || "";
const policyContentid = data?.data?.attributes?.[0]
console.log(policyContentid)
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          message="Error"
          description="Failed to load privacy policy"
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <section className="w-full h-full min-h-screen px-4 py-6">
      <div className="flex justify-between items-center py-5">
        <div className="flex gap-4 items-center">
          <Link to="/settings">
            <IoChevronBack className="text-2xl" />
          </Link>
          <h1 className="text-2xl font-semibold">Privacy Policy</h1>
        </div>

         {policyContent ? (
          <div className="prose max-w-none">
          
              <Link to={`/settings/edit-privacy-policy/${policyContentid._id}`}>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-secondary text-white hover:bg-secondary-dark transition-colors">
            <TbEdit className="size-5" />
            <span>Edit</span>
          </button>
        </Link>
          </div>

        ) : (
        <div>

   
          <Link to={`/settings/edit-privacy-policy/Add`}>
          <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-secondary text-white hover:bg-secondary-dark transition-colors">
            <TbEdit className="size-5" />
            <span>Add</span>
          </button>
        </Link>
      
      
          <p className="text-gray-500">No privacy policy content available.</p> </div>
        )}
         
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mt-4">
        {policyContent ? (
          <div className="prose max-w-none">
            {policyContent.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No privacy policy content available.</p>
        )}
      </div>
    </section>
  );
};

export default PrivacyPolicyPage;