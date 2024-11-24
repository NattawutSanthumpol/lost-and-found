import Navbar from "@/components/Navber";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen flex">
      {/* RIGHT */}
      <div className="w-full bg-[#F7F8FA] overflow-x-auto overflow-y-auto flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
