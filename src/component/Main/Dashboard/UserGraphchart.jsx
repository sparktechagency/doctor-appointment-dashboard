/* eslint-disable react/prop-types */
import { DatePicker } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  ReferenceLine,
  Area,
} from "recharts";
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

const UserGraphChart = () => {
    const data = [
        { month: "Jan", uv: 4100, pv: 2400, amt: 3000 },
        { month: "Feb", uv: 3200, pv: 1398, amt: 2500 },
        { month: "Mar", uv: 1500, pv: 9800, amt: 1500 },
        { month: "Apr", uv: 2800, pv: 3908, amt: 3500 },
        { month: "May", uv: 1200, pv: 4800, amt: 2500 },
        { month: "Jun", uv: 2600, pv: 3800, amt: 4500 },
        { month: "Jul", uv: 1100, pv: 4300, amt: 3700 },
        { month: "Aug", uv: 3000, pv: 4300, amt: 3000 },
        { month: "Sep", uv: 1300, pv: 3900, amt: 4500 },
        { month: "Oct", uv: 2700, pv: 4200, amt: 2500 },
        { month: "Nov", uv: 1400, pv: 4000, amt: 5000 },
        { month: "Dec", uv: 3500, pv: 4100, amt: 3500 },
      ];
      
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const chartData = data.map((monthData) => ({
    month: monthData.month,
    income: monthData.amt, // Corrected key
  }));

  const handleDateChange = (date) => {
    if (date) {
      setSelectedYear(date.year());
    }
  };

  return (
    <section className="w-full col-span-full md:col-span-4 px-5 rounded-lg bg-[#FFFFF] shadow-md">
      <div className="flex justify-between items-center py-3">
        <h1 className="font-semibold">User overview</h1>
        <DatePicker
          onChange={handleDateChange}
          picker="year"
          defaultValue={dayjs(selectedYear.toString())}
        />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x="April" stroke="green" label="Min" />
          <ReferenceLine y={4000} label="Max" stroke="red" strokeDasharray="3 3" />
          <Area type="monotone" dataKey="income" stroke="#E7F5FF" fill="#77C4FE" />
        </AreaChart>
      </ResponsiveContainer>
    </section>
  );
};

export default UserGraphChart;
