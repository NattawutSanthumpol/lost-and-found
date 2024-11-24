"use client";

import { logOut } from "@/lib/actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const { data: session, status, update } = useSession();
  // let isAuthenticated = false;
  const isAuthenticated = status === "authenticated";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     isAuthenticated = true;
  //   } else if (status === "unauthenticated") {
  //     isAuthenticated = false;
  //   }
  // }, [status]);

  // console.log("isAuthenticated => ", isAuthenticated, status);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // เพิ่ม Event Listener
    return () => {
      document.removeEventListener("click", handleClickOutside); // ลบ Event Listener
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-3 bg-white mb-5 drop-shadow-sm">
      {!isAuthenticated && (
        <div className="w-[40%] sm:w-[40%] md:w-[30%] lg:w-[30%] hidden md:block sm:block">
          <Link
            href="/"
            className="flex items-center justify-center lg:justify-start gap-2 w-full"
          >
            <Image
              src="/images/other/logo.png"
              alt="logo"
              width={32}
              height={32}
            />
            <span className="font-bold">Lost And Found</span>
          </Link>
        </div>
      )}

      <div className="flex items-center gap-3 justify-end w-full">
        {isAuthenticated && (
          <>
            <div className="flex flex-col">
              <span className="text-xs leading-3 font-medium">
                {isAuthenticated ? session?.user?.name : ""}
                {/* {currentUser?.user.name} */}
                {/* Admin User */}
              </span>
              <span className="text-[10px] text-gray-500 text-right">
                {isAuthenticated
                  ? session?.user?.role.charAt(0) +
                  session?.user?.role.slice(1).toLowerCase()
                  : ""}
                {/* Admin */}
                {/* {currentUser?.user.role.charAt(0)}{currentUser?.user?.role.slice(1).toLowerCase()} */}
              </span>
            </div>
            <div ref={dropdownRef}>
              <Image
                src={session?.user.image || "/images/other/avatar.png"}
                alt=""
                width={50}
                height={50}
                className="w-10 h-10 rounded-full object-cover"
                onClick={toggleDropdown}
              />
            </div>

            {/* DropDown Menu */}
            {isOpen && (
              <div className="absolute right-7 top-[55px] w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <ul className="py-1 text-sm">
                  <li>
                    <Link
                      href={`/admin/dashboard`}
                      className="block px-4 py-2 text-gray-700  hover:bg-lamaSkyLight"
                    >
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/admin/users/${session.user.id}`}
                      className="block px-4 py-2 text-gray-700  hover:bg-lamaSkyLight"
                    >
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <button
                      className="flex items-center justify-center font-bold gap-2 text-red-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight w-full"
                      //  onClick={handleLogout}
                      onClick={async () => {
                        await logOut();
                        await update();
                        window.location.href = "/"
                        // setTimeout(() => {
                        //   router.push("/");
                        //   router.refresh();
                        // }, 1000)
                        // router.push("/");
                        // router.refresh();
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* End DropDown Menu */}
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link href={`/login`}>
              <button
                type="button"
                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 w-[100px]"
              >
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
