import { auth } from "@/auth";
import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableFilter from "@/components/TableFilter";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { BUCKET_NAME, ITEM_PER_PAGE, SUPABASE_IMAGE_URL } from "@/lib/settings";
import { ItemType, LostItem, LostStatus, Prisma, Student, Teacher, User, UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type LostItemList = LostItem & { itemType: ItemType } & { student: Student } & { teacher: Teacher } & { user: User }

const LostItemListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const params = await searchParams;
  const session = await auth();
  const role = session?.user.role;

  const columns = [
    {
      header: "Info",
      accessor: "info",
    },
    {
      header: "Item Type",
      accessor: "itemType",
      className: "hidden lg:table-cell",
    },
    {
      header: "Location",
      accessor: "location",
      className: "hidden lg:table-cell",
    },
    {
      header: "Found Date",
      accessor: "foundDate",
      className: "hidden lg:table-cell",
    },
    {
      header: "Status",
      accessor: "status",
      className: "hidden lg:table-cell",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden lg:table-cell",
    },
    {
      header: "Teacher",
      accessor: "teacher",
      className: "hidden lg:table-cell",
    },
    {
      header: "CreateBy",
      accessor: "user",
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

  function truncateTextWithWordBoundary(text: string, maxLength: number) {
    if (text.length <= maxLength) {
      return text;
    }
    const truncated = text.substring(0, maxLength - 3).trim();
    return truncated.substring(0, truncated.lastIndexOf(" ")) + "...";
  }

  const renderRow = (item: LostItemList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={SUPABASE_IMAGE_URL + item.img || `${BUCKET_NAME}/imageFound.png`}
          alt=""
          width={40}
          height={40}
          className="xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.itemName}</h3>
          <p className="text-xs text-gray-500">{truncateTextWithWordBoundary(item?.description ?? "", 40)}</p>
        </div>
      </td>
      <td className="hidden lg:table-cell">{item.itemType.typeName}</td>
      <td className="hidden lg:table-cell">{item.location}</td>
      <td className="hidden lg:table-cell">{new Date(item.foundDate).toLocaleDateString("en-GB")}</td>
      {/* <td className="hidden md:table-cell">{new Date(item.foundDate).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}</td> */}
      <td className="hidden lg:table-cell">{item.status}</td>
      <td className="hidden lg:table-cell">{item.student.firstName}</td>
      <td className="hidden lg:table-cell">{item.teacher.firstName}</td>
      <td className="hidden lg:table-cell">{item.user.firstName}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/admin/lostItems/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/images/other/edit.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "ADMIN" && (
            <FormContainer table="lostItem" id={item.id} />

          )}
        </div>
      </td>
    </tr>
  );

  const { page, ...queryParams } = params;

  const p = page ? parseInt(page) : 1;

  // URL PARAMS CONDITION
  const query: Prisma.LostItemWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            query.OR = [
              { itemName: { contains: value, mode: "insensitive" } },
              { location: { contains: value, mode: "insensitive" } },
              { student: { firstName: { contains: value, mode: "insensitive" } } },
              { teacher: { firstName: { contains: value, mode: "insensitive" } } },
              { user: { firstName: { contains: value, mode: "insensitive" } } },
              { itemType: { typeName: { contains: value, mode: "insensitive" } } },
            ];
            break;
          case "status":
            if (Object.values(LostStatus).includes(value as LostStatus)) {
              query.status = value as LostStatus;
            }
            break;
          default:
            break;
        }
      }
    }
  }

  // const currentId = session?.user.id
  // if (currentId) {
  //   query.NOT = [
  //     { id: parseInt(currentId) }
  //   ]
  // }

  const [data, count] = await prisma.$transaction([
    prisma.lostItem.findMany({
      where: query,
      include: {
        itemType: true,
        student: true,
        teacher: true,
        user: true,
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1)
    }),
    prisma.lostItem.count({ where: query })
  ])

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Lost Items</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {/* dropdown search status */}
            <TableFilter />
            {role === "ADMIN" && (
              <Link href={`/admin/lostItems/create`}>
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

export default LostItemListPage