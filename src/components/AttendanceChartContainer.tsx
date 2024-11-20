import AttendanceChart from "./AttendanceChart";

const AttendanceChartContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);

    //   const resData = await prisma.attendance.findMany({
    //     where: {
    //       date: {
    //         gte: lastMonday,
    //       },
    //     },
    //     select: {
    //       date: true,
    //       present: true,
    //     },
    //   });

    // console.log(data)

    const nextFriday = new Date(lastMonday);
    nextFriday.setDate(lastMonday.getDate() + 4); // วันศุกร์คือ +4 จากวันจันทร์

    // ฟังก์ชันสุ่มวันที่เฉพาะวันจันทร์ถึงศุกร์
    const getRandomWeekday = (start: Date, end: Date) => {
        let randomDate: Date;

        do {
            randomDate = new Date(
                start.getTime() + Math.random() * (end.getTime() - start.getTime())
            );
        } while (randomDate.getDay() === 0 || randomDate.getDay() === 6); // กำจัดวันเสาร์-อาทิตย์

        return randomDate;
    };

    // ฟังก์ชันสุ่มค่าต่าง ๆ
    const getRandomBoolean = () => Math.random() < 0.5;
    const getRandomStudentId = () => `student${Math.floor(Math.random() * 30) + 1}`;

    // สร้าง resData
    const resData = Array.from({ length: 60 }, (_, index) => {
        const randomDate = getRandomWeekday(lastMonday, nextFriday);

        return {
            id: index + 1,
            date: randomDate.toISOString(), // เก็บวันที่ในรูปแบบ ISO String
            present: getRandomBoolean(),
            studentId: getRandomStudentId(),
        };
    });


    // const resData = [
    //     {
    //         id: 1,
    //         date: new Date().toString(),
    //         present: true,
    //         studentId: "student1",
    //     },
    //     {
    //         id: 2,
    //         date: new Date().toString(),
    //         present: true,
    //         studentId: "student1",
    //     }, {
    //         id: 3,
    //         date: new Date().toString(),
    //         present: true,
    //         studentId: "student1",
    //     }, {
    //         id: 4,
    //         date: new Date().toString(),
    //         present: false,
    //         studentId: "student1",
    //     }, {
    //         id: 5,
    //         date: new Date().toString(),
    //         present: true,
    //         studentId: "student1",
    //     }, {
    //         id: 6,
    //         date: new Date().toString(),
    //         present: false,
    //         studentId: "student1",
    //     }
    // ]

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const attendanceMap: { [key: string]: { found: number; returned: number } } =
    {
        Mon: { found: 0, returned: 0 },
        Tue: { found: 0, returned: 0 },
        Wed: { found: 0, returned: 0 },
        Thu: { found: 0, returned: 0 },
        Fri: { found: 0, returned: 0 },
    };

    resData.forEach((item) => {
        const itemDate = new Date(item.date);
        const dayOfWeek = itemDate.getDay();

        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];

            if (item.present) {
                attendanceMap[dayName].found += 1;
            } else {
                attendanceMap[dayName].returned += 1;
            }
        }
    });

    const data = daysOfWeek.map((day) => ({
        name: day,
        found: attendanceMap[day].found,
        returned: attendanceMap[day].returned,
    }));

    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Attendance</h1>
            </div>
            <AttendanceChart data={data} />
        </div>
    );
};

export default AttendanceChartContainer;
