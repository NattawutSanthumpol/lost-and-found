import { auth } from "@/auth";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { ItemType, Prisma, UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";

const TypeItemListPage = async ({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) => {
    const params = await searchParams;

    const session = await auth();
    const role = session?.user.role;

    const columns = [
        {
            header: "ID",
            accessor: "id",
        },
        {
            header: "Type Name",
            accessor: "typeName",
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

    const renderRow = (item: ItemType) => (
        <tr
            key={item.id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
        >
            <td className="hidden md:table-cell">{item.id}</td>
            <td className="hidden md:table-cell">{item.typeName}</td>
            <td className="w-[20%]">
                <div className="flex items-center gap-2">
                    <Link href={`/admin/typeItems/${item.id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/images/other/edit.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "ADMIN" && (
                        <FormContainer table="itemType" id={item.id} />
                    )}
                </div>
            </td>
        </tr>
    );

    const { page, ...queryParams } = params;

    const p = page ? parseInt(page) : 1;

    // URL PARAMS CONDITION
    const query: Prisma.ItemTypeWhereInput = {};

    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.typeName = { contains: value, mode: "insensitive" }
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.itemType.findMany({
            where: query,
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.itemType.count({ where: query })
    ])


    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Item Type</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        {role === "ADMIN" && (
                            <Link href={`/admin/typeItems/create`}>
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

export default TypeItemListPage