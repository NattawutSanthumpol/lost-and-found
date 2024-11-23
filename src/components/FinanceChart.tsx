"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// const data = [
//   {
//     name: "Jan",
//     found: 4000,
//     returned: 2400,
//   },
//   {
//     name: "Feb",
//     found: 3000,
//     returned: 1398,
//   },
//   {
//     name: "Mar",
//     found: 2000,
//     returned: 9800,
//   },
//   {
//     name: "Apr",
//     found: 2780,
//     returned: 3908,
//   },
//   {
//     name: "May",
//     found: 1890,
//     returned: 4800,
//   },
//   {
//     name: "Jun",
//     found: 2390,
//     returned: 3800,
//   },
//   {
//     name: "Jul",
//     found: 3490,
//     returned: 4300,
//   },
//   {
//     name: "Aug",
//     found: 3490,
//     returned: 4300,
//   },
//   {
//     name: "Sep",
//     found: 3490,
//     returned: 4300,
//   },
//   {
//     name: "Oct",
//     found: 3490,
//     returned: 4300,
//   },
//   {
//     name: "Nov",
//     found: 3490,
//     returned: 4300,
//   },
//   {
//     name: "Dec",
//     found: 3490,
//     returned: 4300,
//   },
// ];

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// ฟังก์ชันสุ่มเลขในช่วงที่กำหนด
const getRandomNumber = (min: number, max: number) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

// สร้างข้อมูลแบบสุ่ม
const data = months.map((month) => ({
  name: month,
  found: getRandomNumber(1000, 5000), // กำหนดช่วงสำหรับ "found"
  returned: getRandomNumber(1000, 5000), // กำหนดช่วงสำหรับ "returned"
}));

const FinanceChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Lost Items Yearly</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false}  tickMargin={20}/>
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="found"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line type="monotone" dataKey="returned" stroke="#CFCEFF" strokeWidth={5}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
