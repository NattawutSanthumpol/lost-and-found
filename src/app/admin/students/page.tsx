import { auth } from "@/auth";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { BUCKET_NAME, ITEM_PER_PAGE, SUPABASE_IMAGE_URL } from "@/lib/settings";
import { Prisma, Student, UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const StudentListPage = async ({ searchParams }: { searchParams: { [key: string]: string | undefined }; }) => {
    const params = await searchParams;

    const session = await auth();
    const role = session?.user.role;

    const columns = [
        {
            header: "Info",
            accessor: "info",
        },
        {
            header: "Phone",
            accessor: "phone",
            className: "hidden lg:table-cell",
        },
        ...(role === UserRole.ADMIN.toString()
            ? [
                {
                    header: "Actions",
                    accessor: "action",
                },
            ]
            : []),
    ];

    const renderRow = (item: Student) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={SUPABASE_IMAGE_URL + item.img || `${BUCKET_NAME}/noAvatar.png`}
                    alt=""
                    width={40}
                    height={40}
                    className="xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.firstName} {item.lastName}</h3>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            {/* <td className="hidden md:table-cell">{item.id}</td> */}
            <td className="hidden md:table-cell">{item.phone}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/admin/students/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/images/other/edit.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "ADMIN" && (
                        <FormContainer table="student" id={item.id} />
                    )}
                </div>
            </td>
        </tr>
    );

    const { page, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION
    const query: Prisma.StudentWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.OR = [
                            { firstName: { contains: value, mode: "insensitive" } },
                            { lastName: { contains: value, mode: "insensitive" } },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.student.count({ where: query })
    ])

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Student</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        {role === "ADMIN" && (
                            <Link href={`/admin/students/create`}>
                                <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaYellow">
                                    <Image src="/images/other/plus.png" alt="" width={16} height={16} />
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={data} />
            {/* PAGINATION */}
            <Pagination page={p} count={count} />
        </div>
    )
}

export default StudentListPage