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
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {/* Total Patients */}
            <div className="flex items-center justify-between p-6 rounded-xl bg-[#77C4FE] w-full">
                <div className="size-25 p-4 flex justify-center items-center">
                    <img src={OrganizationImage} alt="Patients" className="w-[90px] h-[90px]" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-end text-4xl font-bold text-white">
                        {data?.user?.totalUser ?? "0"}
                    </h1>
                    <h1 className="text-gray-100 text-lg font-medium">Total Patients</h1>
                </div>
            </div>
            
            {/* Total Earnings */}
            <div className="flex items-center justify-between p-6 rounded-xl bg-[#77C4FE] w-full">
                <div className="size-25 p-4 flex justify-center items-center">
                    <img src={Frame1} alt="Earnings" className="w-[90px] h-[90px]" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-end text-4xl font-bold text-white">
                        ${totalEarnings}
                    </h1>
                    <h1 className="text-gray-100 text-lg font-medium">Total Earnings</h1>
                </div>
            </div>
            
            {/* Pending Appointments */}
            <div className="flex items-center justify-between p-6 rounded-xl bg-[#77C4FE] w-full">
                <div className="size-25 p-4 flex justify-center items-end">
                    <img src={Frame2} alt="Pending" className="w-[90px] h-[90px]" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-end text-4xl font-bold text-white">
                        {data?.appointment?.pendingAppointments ?? "0"}
                    </h1>
                    <h1 className="text-gray-100 text-lg font-medium">Daily affirmation</h1>
                </div>
            </div>
            
            {/* Total Appointments */}
            <div className="flex items-center justify-between p-6 rounded-xl bg-[#77C4FE] w-full">
                <div className="size-25 p-4 flex justify-center items-center">
                    <img src={Frame3} alt="Appointments" className="w-[90px] h-[90px]" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-end text-4xl font-bold text-white">
                        {data?.appointment?.totalAppointments ?? "0"}
                    </h1>
                    <h1 className="text-gray-100 text-lg font-medium">Recent Appointment</h1>
                </div>
            </div>
        </div>
    );
};

export default Status;