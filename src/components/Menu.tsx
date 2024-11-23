import Link from "next/link";
import Image from "next/image";
import { UserRole } from "@prisma/client";
import { auth } from "@/auth";
import { IoHomeOutline } from "react-icons/io5";
import { TbUsers } from "react-icons/tb";
import { PiStudentLight, PiCodesandboxLogo , PiListMagnifyingGlassLight,PiUserListLight  } from "react-icons/pi";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <IoHomeOutline size={22} />, //  //"/images/other/home.png"
        label: "Home",
        href: "/admin/dashboard",
        visible: [UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      },
      {
        icon: <PiListMagnifyingGlassLight  size={22} />, // "/images/other/exam.png"
        label: "Lost Item",
        href: "/admin/lostItems",
        visible: [UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      },
      {
        icon: <HiOutlineClipboardDocumentList size={22} />, //"/images/other/subject.png"
        label: "Type Item",
        href: "/admin/typeItems",
        visible: [UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      },
      {
        icon: <LiaChalkboardTeacherSolid size={22} />, //"/images/other/teacher.png"
        label: "Teachers",
        href: "/admin/teachers",
        visible: [UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      },
      {
        icon: <PiStudentLight size={22} />, //"/images/other/student.png"
        label: "Students",
        href: "/admin/students",
        visible: [UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      },
      {
        icon: <PiUserListLight  size={22} />, //"/images/other/profile.png"
        label: "Users",
        href: "/admin/users",
        visible: [UserRole.ADMIN.toString()],
      },
      {
        icon: <PiListMagnifyingGlassLight size={22} />, //"/images/other/profile.png"
        label: "Lost Items",
        href: "/lostItem",
        visible: ["GUEST", UserRole.ADMIN.toString(), UserRole.TEACHER.toString()],
      }
    ]
  }
]

const Menu = async () => {
  const session = await auth();
  const role = session?.user.role || "GUEST";

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <div className="flex flex-col gap-2" key={i.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(role)) {
              return (
                <Link
                  href={item.href}
                  key={item.label}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight"
                >
                  {/* <Image src={item.icon} alt="" width={20} height={20} /> */}
                  {item.icon}
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu;