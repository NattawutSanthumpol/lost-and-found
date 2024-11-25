import prisma from "@/lib/prisma";
import FinanceChart from "./FinanceChart";

// // ฟังก์ชันสุ่มเลขในช่วงที่กำหนด
// const getRandomNumber = (min: number, max: number) =>
//   Math.floor(Math.random() * (max - min + 1)) + min;

// // สร้างข้อมูลแบบสุ่ม
// const data = months.map((month) => ({
//   name: month,
//   found: getRandomNumber(1000, 5000), // กำหนดช่วงสำหรับ "found"
//   returned: getRandomNumber(1000, 5000), // กำหนดช่วงสำหรับ "returned"
// }));

const FinanceChartContainer = async () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const currentYear = new Date().getFullYear();
  const startDate = new Date(currentYear, 0, 1);
  const endDate = new Date(currentYear, 11, 31, 23, 59, 59);

  const resData = await prisma.lostItem.findMany({
    where: {
      foundDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      foundDate: true,
      status: true,
    },
  });

  // console.log(resData);

  const data = Array(12)
    .fill(0)
    .map((_, index) => ({
      name: months[index],
      found: 0,
      returned: 0,
    }));

  resData.forEach(({ foundDate, status }) => {
    const monthIndex = new Date(foundDate).getMonth(); // ดึงเดือน (0 = January, 11 = December)
    if (status === "FOUND") {
      data[monthIndex].found++;
    } else if (status === "RETURNED") {
      data[monthIndex].returned++;
    }
  });

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Lost Items Yearly</h1>
      </div>
      <FinanceChart data={data} />
    </div>
  );
};

export default FinanceChartContainer;
