"use client";
import { getItemTypeById, getTeacherById, updateItemType, updateTeacher } from "@/lib/actions";
import { ItemTypeSchema, itemTypeSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemType, Teacher } from "@prisma/client";
import Link from "next/link";
import { useParams,useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const EditTypeItemPage = () => {
    const router = useRouter();
    const params = useParams();
    const id: number = Array.isArray(params.id)
        ? parseInt(params.id[0])
        : params.id
            ? parseInt(params.id)
            : 0;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
      } = useForm<ItemTypeSchema>({
        resolver: zodResolver(itemTypeSchema),
      });
    
      useEffect(() => {
        if (id) {
          const fetchTypeItem = async () => {
            try {
              const data: ItemType | null = await getItemTypeById(id);
              if (data !== null) {
                setValue("typeName", data.typeName);
                setLoading(false);
              }
              console.log(data);
            } catch (error) {
              toast.error(`Failed to fetch teacher data: ${error}`);
            }
          };
          fetchTypeItem();
        }
      }, [id, setValue]);
    
      const onSubmit = async (data: ItemTypeSchema) => {
        setIsSubmitting(true);
        const result = await updateItemType({ ...data }, id);
        setIsSubmitting(false);
    
        if (result.success) {
          toast.success("Teacher updated successfully!");
          router.push("/admin/typeItems");
          router.refresh();
        } else {
          toast.error("Failed to update teacher. Please try again.");
        }
      };

      if (loading) return <p>Loading...</p>;

      return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="container mx-auto p-4 ">
                {/* Header */}
                <h1 className="text-center text-3xl font-bold mb-6">
                    Create a new Type Item
                </h1>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex justify-center w-[40%] mx-auto"
                >
                    {/* Column 1: Image Upload */}
                    {/* Column 2: Form Fields */}
                    <div className="w-full">
                        <div className="mb-4">
                            <label className="block text-sm font-medium">Type Items Name</label>
                            <input
                                {...register("typeName")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.typeName && (
                                <span className="text-red-500 text-sm">
                                    {errors.typeName.message}
                                </span>
                            )}
                        </div>

                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-2">
                            <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-blue-400 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Update"}
                            </button>
                            <Link href={`/admin/typeItems`}>
                                <button
                                    type="button"
                                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                >
                                    Cancel
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditTypeItemPage