
import Frame1 from "../../../assets/auth/Frame1.png";
import Frame2 from "../../../assets/auth/Frame2.png";
import Frame3 from "../../../assets/auth/Frame3.png";
import OrganizationImage from "../../../assets/auth/user.png";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";

const Status = () => {
    const {data} = useGetDashboardStatusQuery();
    console.log(data)
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
    <div className="flex items-center justify-between p-5 rounded-lg bg-secondary w-full">
      <div className="size-16 p-3 flex justify-center items-center">
        <img src={OrganizationImage} alt="logo" className="w-[64px]  h-[50px]  mb-5" />
      </div>
      <div className="space-y-2">
        <h1 className="text-center text-3xl font-semibold text-white">
          {data?.totalEarnings ?? "1200"}
        </h1>
        <h1 className="text-gray-200">Total Patient</h1>
      </div>
    </div>
    <div className="flex items-center justify-between p-5 rounded-lg bg-secondary w-full">
      <div className="size-16 p-3 flex justify-center items-center">
        <img src={Frame1} alt="logo" className="w-[64px]  h-[50px]  mb-5" />
      </div>
      <div className="space-y-2">
        <h1 className="text-center text-3xl font-semibold text-white">
          ${data?.totalUser ?? "2.5"}k
        </h1>
        <h1 className="text-gray-200">Total Earnings</h1>
      </div>
    </div>
    <div className="flex items-center justify-between p-5 rounded-lg bg-secondary w-full">
      <div className="size-16 p-3 flex justify-center items-center">
        <img src={Frame2} alt="logo" className="w-[64px]  h-[50px]  mb-5" />
      </div>
      <div className="space-y-2">
        <h1 className="text-center text-3xl font-semibold text-white">
          {data?.totalOrganizations  ?? "1200"} 
        </h1>
        <h1 className="text-gray-200">Daily affirmation</h1>
      </div>
    </div>
    <div className="flex items-center justify-between p-5 rounded-lg bg-secondary w-full">
      <div className="size-16 p-3 flex justify-center items-center">
        <img src={Frame3} alt="logo" className="w-[64px]  h-[50px]  mb-5" />
      </div>
      <div className="space-y-2">
        <h1 className="text-center text-3xl font-semibold text-white">
          {data?.totalOrganizations  ?? "1200"} 
        </h1>
        <h1 className="text-gray-200">Recent Appointment</h1>
      </div>
    </div>
  </div>
  
  );
};

export default Status;
