"use client";

import { userSchema, UserSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { createUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { UserRole, UserSex } from "@prisma/client";

const CreateUserPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSchema>({
        resolver: zodResolver(userSchema),
    });

    const onSubmit = async (data: UserSchema) => {
        // console.log(data);
        setIsSubmitting(true);
        const result = await createUser({ ...data, img: image });
        console.log("result => ", result);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("user created successfully!");
            router.push("/admin/users");
            router.refresh();
        } else if (result.error) {
            toast.error(result.message);
        } else {
            toast.error(`Failed to create user. Please try again. Error: ${result.message}`);
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
                    Create a new user
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
                        {errors.img && (
                                <span className="text-red-500 text-sm">
                                    {errors.img.message}
                                </span>
                            )}
                    </div>

                    {/* Column 2: Form Fields */}
                    <div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">User Name<span className="text-red-600 text-lg">*</span></label>
                            <input
                                {...register("username")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-sm">
                                    {errors.username.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Password<span className="text-red-600 text-lg">*</span></label>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full p-2 border rounded"
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {errors.password.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Confirm Password<span className="text-red-600 text-lg">*</span></label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full p-2 border rounded"
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm">
                                    {errors.confirmPassword.message}
                                </span>
                            )}
                        </div>


                        <div className="mb-4">
                            <label className="block text-sm font-medium">First Name<span className="text-red-600 text-lg">*</span></label>
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
                            <label className="block text-sm font-medium">Last Name<span className="text-red-600 text-lg">*</span></label>
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
                            <label className="block text-sm font-medium">Email<span className="text-red-600 text-lg">*</span></label>
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
                                {/* <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option> */}
                                {Object.values(UserSex).map((sex) => (
                                    <option key={sex} value={sex}>
                                        {sex.charAt(0) + sex.substring(1).toLocaleLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.sex && (
                                <span className="text-red-500 text-sm">
                                    {errors.sex.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Role</label>
                            <select
                                {...register("role")}
                                className="w-full p-2 border rounded"
                            >
                                {/* <option value="ADMIN">Admin</option>
                                <option value="TEACHER">Teacher</option> */}
                                {Object.values(UserRole).map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0) + role.substring(1).toLocaleLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <span className="text-red-500 text-sm">
                                    {errors.role.message}
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
                            <Link href={`/admin/users`}>
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

export default CreateUserPage;
