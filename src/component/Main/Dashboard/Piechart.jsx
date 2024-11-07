import { PieChart, Pie, Cell } from 'recharts';
import { Select } from 'antd';
import { useState } from 'react';

const sampleData = {
  august: { totalUsers: 1000, totalEmployees: 400, totalManagers: 200, month: 'August' },
  september: { totalUsers: 1200, totalEmployees: 450, totalManagers: 250, month: 'September' },
};

const Piechart = () => {
  const [month, setMonth] = useState('august');
  const userRatio = sampleData[month]; // Using sample data here

  const data = [
    { name: 'Total Users', value: userRatio.totalUsers },
    { name: 'Total Employees', value: userRatio.totalEmployees },
    { name: 'Total Managers', value: userRatio.totalManagers },
  ];

  const COLORS = ['#f7cc50', '#d4b24f', '#f8efba'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleChange = (value) => {
    setMonth(value);
  };

  return (
    <div className='w-full col-span-full md:col-span-2  rounded-lg p-5'>
      <div className='flex justify-between items-center py-2 mx-6'>
        <div>
          <h1 className='font-medium text-6'>User Ratio for {userRatio.month}</h1>
        </div>
        <div>
          <Select
            defaultValue={month} className='border-none'
            style={{ width: 100 }}
            onChange={handleChange}
            options={[
              { value: 'august', label: 'August' },
              { value: 'september', label: 'September' },
            ]}
          />
        </div>
      </div>  
      <div className='flex justify-around items-center gap-3 mt-8'>
        <div>
          <PieChart className='px-2' width={200} height={200}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </div>
        <div>
          <div>
            <p className='text-[10px] font-normal'>Total Users for {userRatio.month}</p>
            <h1 className='text-[18px] font-semibold'>{userRatio.totalUsers}</h1>
          </div>
          <div className='mt-[23px]'>
            <p className='text-[10px] font-normal'>Total Employees for {userRatio.month}</p>
            <h1 className='text-[18px] font-semibold'>{userRatio.totalEmployees}</h1>
          </div>
          <div className='mt-[23px]'>
            <p className='text-[10px] font-normal'>Total Managers for {userRatio.month}</p>
            <h1 className='text-[18px] font-semibold'>{userRatio.totalManagers}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Piechart;
