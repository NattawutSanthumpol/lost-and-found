import { LostStatus } from "@prisma/client";
// import Image from "next/image";

const UserCard = async ({
  type,
}: {
  type: LostStatus ;
}) => {
//   const modelMap: Record<typeof type, any> = {
//     admin: prisma.admin,
//     teacher: prisma.teacher,
//     student: prisma.student,
//     parent: prisma.parent,
//   };

  const toDate = new Date()

//   const data = await modelMap[type].count();
  
    return (
        <div className="rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    {toDate.getFullYear()}/{toDate.getMonth()}
                </span>
            </div>
            <h1 className="text-2xl font-semibold my-4">
                {/* {data} */}
                5
            </h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">
                {type.charAt(0)+ type.substring(1).toLowerCase()}s
            </h2>
        </div>
    );
};

export default UserCard;
