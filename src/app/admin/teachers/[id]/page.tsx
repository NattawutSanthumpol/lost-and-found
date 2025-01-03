"use client";

import { teacherSchema, TeacherSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getTeacherById, updateTeacher } from "@/lib/actions";
import { toast } from "react-toastify";
import { Teacher } from "@prisma/client";
import Link from "next/link";
import { BUCKET_NAME, SUPABASE_IMAGE_URL } from "@/lib/settings";

const EditTeacherPage = () => {
  const router = useRouter();
  const params = useParams();
  const teacherId: number = Array.isArray(params.id)
    ? parseInt(params.id[0])
    : params.id
    ? parseInt(params.id)
    : 0;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<string>("");
  const [imageTemp, setImageTemp] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

  useEffect(() => {
    if (teacherId) {
      const fetchTeacher = async () => {
        try {
          const data: Teacher | null = await getTeacherById(teacherId);
          if (data !== null) {
            setValue("firstName", data.firstName);
            setValue("lastName", data.lastName);
            setValue("email", data.email ?? "");
            setValue("phone", data.phone ?? "");
            setValue("sex", data.sex);
            if (data.img) setImage(data.img);
            setLoading(false);
          }
          console.log(data);
        } catch (error) {
          toast.error(`Failed to fetch teacher data: ${error}`);
        }
      };
      fetchTeacher();
    }
  }, [teacherId, setValue]);

  const onSubmit = async (data: TeacherSchema) => {
    setIsSubmitting(true);
    const result = await updateTeacher({ ...data, img: image }, teacherId);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Teacher updated successfully!");
      router.push("/admin/teachers");
      router.refresh();
    } else {
      toast.error(
        `Failed to update teacher. Please try again. Error: ${result.message}`
      );
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (file) {
      const fileType = file.type.split("/")[0];
      if (fileType === "image") {
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
          setImageTemp(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please select an image file.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="container mx-auto p-4">
        {/* Header */}
        <h1 className="text-center text-3xl font-bold mb-6">Edit teacher</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Column 1: Image Upload */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 border rounded-full overflow-hidden">
              {image ? (
                <Image
                  src={
                    imageTemp.startsWith("data:image")
                      ? imageTemp
                      : SUPABASE_IMAGE_URL + image ||
                        `${BUCKET_NAME}/noAvatar.png`
                  }
                  alt="Uploaded"
                  className="w-full h-full rounded-full object-cover"
                  width={500}
                  height={500}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  No Image
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif"
              className="mt-4"
              onChange={handleImageUpload}
            />
          </div>

          {/* Column 2: Form Fields */}
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                className="w-full p-2 border rounded"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                {...register("lastName")}
                className="w-full p-2 border rounded"
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full p-2 border rounded"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Phone</label>
              <input
                {...register("phone")}
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Sex</label>
              <select
                {...register("sex")}
                className="w-full p-2 border rounded"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
              {errors.sex && (
                <span className="text-red-500 text-sm">
                  {errors.sex.message}
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
              <Link href={`/admin/teachers`}>
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
};

export default EditTeacherPage;
