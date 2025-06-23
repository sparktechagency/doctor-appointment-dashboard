import { DatePicker } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { useState } from "react";
import dayjs from "dayjs";
import { useGetUserRatioQuery } from "../../../redux/features/dashboard/dashboardApi";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="label font-semibold">{`Month: ${label}`}</p>
        <p className="intro">{`Total Users: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const UserGraphChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { data: userData, isLoading, isError } = useGetUserRatioQuery(selectedYear);

  // Format the data for the chart
  const chartData = userData?.monthlyUserCount?.map((monthData) => ({
    month: monthData.month,
    users: monthData.totalUsers,
  })) || [];

  const handleDateChange = (date) => {
    if (date) {
      setSelectedYear(date.year());
    }
  };

  if (isLoading) return <div>Loading user data...</div>;
  if (isError) return <div>Error loading user data</div>;

  return (
    <section className="w-full col-span-full md:col-span-4 px-5 rounded-lg bg-white shadow-md">
      <div className="flex justify-between items-center py-3">
        <h1 className="font-semibold">User Overview</h1>
        <DatePicker
          onChange={handleDateChange}
          picker="year"
          defaultValue={dayjs(selectedYear.toString())}
          disabledDate={(current) => current && current.year() > new Date().getFullYear()}
        />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis 
            dataKey="month" 
            interval={0} // Show all months
          />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="users" 
            stroke="#E7F5FF" 
            fill="#77C4FE" 
            fillOpacity={0.8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default UserGraphChart;