"use client";

import { studentSchema, StudentSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createStudent } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";

const CreateStudentPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentSchema>({
        resolver: zodResolver(studentSchema),
    });

    const onSubmit = async (data: StudentSchema) => {
        // console.log(data);
        setIsSubmitting(true);
        const result = await createStudent({ ...data, img: image });
        console.log("result => ", result);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Student created successfully!");
            router.push("/admin/students");
        } else if (result.error) {
            toast.error(result.message);
        } else {
            toast.error(`Failed to create student. Please try again. Error: ${result.message}`);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileType = file.type.split("/")[0];
            if (fileType === "image") {
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result as string);
                reader.readAsDataURL(file);
            }
            else {
                toast.error("Please select an image file.");
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="container mx-auto p-4">
                {/* Header */}
                <h1 className="text-center text-3xl font-bold mb-6">
                    Create a new student
                </h1>

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
                                    src={image}
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
                            {errors.phone && (
                                <span className="text-red-500 text-sm">
                                    {errors.phone.message}
                                </span>
                            )}
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
                                {isSubmitting ? "Saving..." : "Create"}
                            </button>
                            <Link href={`/admin/students`}>
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

export default CreateStudentPage