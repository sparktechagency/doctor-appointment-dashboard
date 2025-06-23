import Frame1 from "../../../assets/auth/Frame1.png";
import Frame2 from "../../../assets/auth/Frame2.png";
import Frame3 from "../../../assets/auth/Frame3.png";
import OrganizationImage from "../../../assets/auth/user.png";
import { useGetDashboardStatusQuery } from "../../../redux/features/dashboard/dashboardApi";

const Status = () => {
    const { data } = useGetDashboardStatusQuery();

    
    // Calculate total earnings by summing up all earnings types
    const totalEarnings = data 
        ? (data.earnings.pendingEarnings + data.earnings.completedEarnings + data.earnings.canceledEarnings).toFixed(2)
        : "0.00";

    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
            {/* Total Patients (using totalUser from user data) */}
            <div className="flex items-center justify-between p-5 rounded-lg bg-[#77C4FE] w-full">
                <div className="size-16 p-3 flex justify-center items-center">
                    <img src={OrganizationImage} alt="logo" className="w-[64px] h-[40px] mb-5" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-center text-3xl font-semibold text-white">
                        {data?.user?.totalUser ?? "0"}
                    </h1>
                    <h1 className="text-gray-200">Total Patient</h1>
                </div>
            </div>
            
            {/* Total Earnings */}
            <div className="flex items-center justify-between p-5 rounded-lg bg-[#77C4FE] w-full">
                <div className="size-16 p-3 flex justify-center items-center">
                    <img src={Frame1} alt="logo" className="w-[64px] h-[40px] mb-5" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-center text-3xl font-semibold text-white">
                        ${totalEarnings}
                    </h1>
                    <h1 className="text-gray-200">Total Earnings</h1>
                </div>
            </div>
            
            {/* Daily Affirmation (using pending appointments) */}
            <div className="flex items-center justify-between p-5 rounded-lg bg-[#77C4FE] w-full">
                <div className="size-16 p-3 flex justify-center items-center">
                    <img src={Frame2} alt="logo" className="w-[64px] h-[40px] mb-5" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-center text-3xl font-semibold text-white">
                        {data?.appointment?.pendingAppointments ?? "0"}
                    </h1>
                    <h1 className="text-gray-200">Pending Appointments</h1>
                </div>
            </div>
            
            {/* Recent Appointment (using total appointments) */}
            <div className="flex items-center justify-between p-5 rounded-lg bg-[#77C4FE] w-full">
                <div className="size-16 p-3 flex justify-center items-center">
                    <img src={Frame3} alt="logo" className="w-[64px] h-[40px] mb-5" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-center text-3xl font-semibold text-white">
                        {data?.appointment?.totalAppointments ?? "0"}
                    </h1>
                    <h1 className="text-gray-200">Total Appointments</h1>
                </div>
            </div>
        </div>
    );
};

export default Status;