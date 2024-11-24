"use client";

import { getAllLostItems } from "@/lib/actions";
import { ItemType, LostItem, Student, Teacher, User } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "../Loading";

type LostItemList = LostItem & { itemType: ItemType } & { student: Student } & { teacher: Teacher } & { user: User }

const LostItemPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<LostItemList[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostItemList[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const getItems = await getAllLostItems();
        // console.log(getItems);
        if (getItems) {
          setItems(getItems);
          setFilteredItems(getItems)
        }
      } catch (error) {
        toast.error(`Failed to fetch item type : ${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);


  // Filter items based on search input
  useEffect(() => {
    const filtered = items.filter(
      (item) =>
        item.itemName.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase()) ||
        item.student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        item.foundDate.toLocaleDateString("en-GB").includes(search)
    );
    setFilteredItems(filtered);
  }, [search, items]);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-6">รายการของหาย</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="ค้นหารายการ เช่น ชื่อ, สถานที่"
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (<Loading />)
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* Image */}
                    <Image
                      src={item.img || "/imageFound.png"}
                      alt={item.itemName}
                      className="w-full h-50 object-cover p-6"
                      width={500}
                      height={500}
                    />

                    {/* Details */}
                    <div className="p-4">
                      <h2 className="text-lg font-semibold">{item.itemName}</h2>
                      <p className="text-sm text-gray-500"><span className="font-bold">สถานที่:</span> {item.location}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">นักเรียนผู้พบ:</span> {item.student.firstName} {item.student.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="font-bold">วันที่:</span> {new Date(item.foundDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full font-bold text-lg">
                  ไม่มีข้อมูลที่ตรงกับการค้นหา
                </p>
              )}
            </div>)}
        {/* Cards */}

      </div>
    </div>
  );
};

export default LostItemPage;
