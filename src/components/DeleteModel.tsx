/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Form = ({
  formAction,
  table,
  id,
  setOpen,
}: {
  formAction: (data: FormData) => Promise<{ success: boolean; error: boolean }>;
  table: "teacher" | "student" | "itemType" | "lostItem" | "user";
  id: number | string | undefined;
  setOpen: (state: boolean) => void;
}) => {
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    if (id) {
      formData.append("id", id.toString());
    }

    const result = await formAction(formData);

    if (result.success) {
      toast.success(`${table} has been deleted!`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Failed to delete the data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <span className="text-center font-medium text-lg">
        All data will be lost. Are you sure you want to delete this {table}?
      </span>
      <button
        type="submit"
        className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
      >
        Delete
      </button>
    </form>
  );
};

export default Form;
