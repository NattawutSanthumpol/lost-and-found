"use client";

import {
  deleteItemType,
  deleteLostItem,
  deleteStudent,
  deleteTeacher,
  deleteUser,
} from "@/lib/actions";
import Image from "next/image";
import { useState } from "react";
import { FormContainerProps } from "./FormContainer";
import DeleteModel from "./DeleteModel";

const deleteActionMap = {
  teacher: deleteTeacher,
  student: deleteStudent,
  itemType: deleteItemType,
  lostItem: deleteLostItem,
  user: deleteUser,
};

const FormModal = ({
  table,
  id,
}: FormContainerProps) => {
  const size = "w-7 h-7";
  const bgColor = "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const formAction = deleteActionMap[table];

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image
          src={`/images/other/delete.png`}
          alt=""
          width={16}
          height={16}
        />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            {formAction && (
              <DeleteModel
                formAction={formAction}
                table={table}
                id={id}
                setOpen={setOpen}
              />
            )}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/images/other/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
