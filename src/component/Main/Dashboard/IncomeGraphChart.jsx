/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { useGetIncomeRatioQuery } from "../../../redux/features/dashboard/dashboardApi";
import { useState } from "react";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
        <p className="label font-semibold">{`Month: ${label}`}</p>
        <p className="intro">{`Total Income: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

const IncomeGraphChart = () => {
  const incomeData = [
    { month: "Jan", totalEarnings: 1500 },
    { month: "Feb", totalEarnings: 2000 },
    { month: "Mar", totalEarnings: 1800 },
    { month: "Apr", totalEarnings: 2200 },
    { month: "May", totalEarnings: 2500 },
    { month: "June", totalEarnings: 2400 },
    { month: "Jul", totalEarnings: 2100 },
    { month: "Aug", totalEarnings: 2300 },
    { month: "Sep", totalEarnings: 2600 },
    { month: "Oct", totalEarnings: 2800 },
    { month: "Nov", totalEarnings: 3000 },
    { month: "Dec", totalEarnings: 3200 },
  ];
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // const { data: incomeData } = useGetIncomeRatioQuery(selectedYear);

  const chartData = incomeData?.map((monthData) => ({
    month: monthData.month,
    income: monthData.totalEarnings,
  }));

  const handleDateChange = (date) => {
    if (date) {
      setSelectedYear(date.year());
    }
  };

  return (
    <section className="w-full col-span-full md:col-span-4  px-5 rounded-lg bg-[#FFFFFF] shadow-md">
      <div className="flex justify-between items-center py-3">
        <h1 className="font-semibold">Income Ratio</h1>
        <DatePicker
          onChange={handleDateChange}
          picker="year"
          defaultValue={dayjs(selectedYear.toString())}
        />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            interval={0} // Ensure all months are shown
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="income" barSize={20} fill="#77C4FE" />
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
};

export default IncomeGraphChart;
