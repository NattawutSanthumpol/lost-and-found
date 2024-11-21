import { auth } from "@/auth";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="flex items-center justify-between p-4">
      <div
        className="flex items-center gap-6 justify-end w-full"
      >
        <div className="flex flex-col">
          <span className="text-xs leading-3 font-medium">
            {session === null ? "GUEST" : session?.user.name}
            {/* Admin User */}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {session === null ? "" : session?.user.role.charAt(0)}{session?.user.role.substring(1).toLocaleLowerCase()}

            {/* Admin */}
          </span>
        </div>
        <Image
          src="/images/other/avatar.png"
          alt=""
          width={30}
          height={30}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Navbar;
