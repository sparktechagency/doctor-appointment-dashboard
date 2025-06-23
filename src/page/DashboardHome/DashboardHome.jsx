import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
// import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentAppoinment from "../../component/Main/Dashboard/RecentAppoinment";
import Status from "../../component/Main/Dashboard/Status";
import UserGraphChart from "../../component/Main/Dashboard/UserGraphchart";
const DashboardHome = () => {
  return (
    <section>
      <div className="px-2 pb-5 space-y-5">
        <Status />
        <div className="">
        <div className="md:flex justify-between items-center md:space-x-2 space-y-2">
        <UserGraphChart/>        
        <IncomeGraphChart/>
        </div>
        {/* <Piechart/> */}
        </div>
        <RecentAppoinment/>
      </div>
    </section>
  );
};

export default DashboardHome;
