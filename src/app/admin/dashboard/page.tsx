import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import CountChartContainer from "@/components/CountChartContainer";
import FinanceChart from "@/components/FinanceChart";

const AdminPage = () => {
  return (
    // <div className="p-4 flex gap-4 flex-col md:flex-row">
    <div className="w-[90%] mx-auto p-4 flex gap-4 flex-col md:flex-row max-w-screen-xl">
      {/* LEFT */}
      <div className="w-full lg:w-4/4 flex flex-col gap-8">
        {/* USER CARDS */}
        {/* <div className="flex gap-4 justify-between flex-wrap">

        </div> */}
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full flex flex-row gap-4">
          <div className="w-full h-[450px]">
            <FinanceChart />
          </div>
          {/* <div className="w-full lg:w-1/5 h-[450px] flex flex-col gap-y-5">
            <UserCard type={LostStatus.FOUND} />
            <UserCard type={LostStatus.RETURNED} />
          </div> */}
        </div>
      </div>
      {/* RIGHT */}
      {/* <div className="w-full lg:w-1/3 flex flex-col gap-8"> */}
      {/* <EventCalendarContainer searchParams={searchParams}/>
        <Announcements /> */}
      {/* </div> */}
    </div>
  )
}

export default AdminPage