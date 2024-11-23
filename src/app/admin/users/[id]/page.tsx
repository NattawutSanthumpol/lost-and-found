"use client";

import {
    updateUserSchema,
    userSchema,
} from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getUserById, updateUser, updateUserNonPassword } from "@/lib/actions";
import { toast } from "react-toastify";
import { User, UserRole, UserSex } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";

const EditUserPage = () => {
    const router = useRouter();
    const params = useParams();
    const { data: session, status } = useSession();
    const userId: number = Array.isArray(params.id)
        ? parseInt(params.id[0])
        : params.id
            ? parseInt(params.id)
            : 0;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [isEditPassword, setIsEditPassword] = useState(false);

    const isCurrentUser =
        status === "authenticated" &&
        session?.user.id &&
        userId === parseInt(session.user.id);

    const schema = isEditPassword ? userSchema : updateUserSchema;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (userId) {
            const fetchUser = async () => {
                try {
                    const data: User | null = await getUserById(userId);
                    if (data !== null) {
                        setValue("username", data.username);
                        // setValue("password", data.password);
                        setValue("firstName", data.firstName);
                        setValue("lastName", data.lastName);
                        setValue("email", data.email ?? "");
                        setValue("phone", data.phone ?? "");
                        setValue("sex", data.sex);
                        setValue("role", data.role);
                        if (data.img) setImage(data.img);
                        setLoading(false);
                    }
                    // console.log(data);
                } catch (error) {
                    toast.error(`Failed to fetch user data: ${error}`);
                }
            };
            fetchUser();
        }
    }, [userId, setValue]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        console.log(isEditPassword);
        const result = isEditPassword
            ? await updateUser({ ...data, img: image }, userId)
            : await updateUserNonPassword({ ...data, img: image }, userId)
        setIsSubmitting(false);

        if (result.success) {
            toast.success("user updated successfully!");
            router.push("/admin/users");
            router.refresh();
        } else {
            // toast.error(`Failed to update user. Please try again. ${result.message}`);
            toast.error(`${result.message}`);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            const fileType = file.type.split("/")[0];
            if (fileType === "image") {
                const reader = new FileReader();
                reader.onload = () => setImage(reader.result as string);
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
                <h1 className="text-center text-3xl font-bold mb-6">Edit user</h1>

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
                                    src={image || "/images/other/noAvatar.png"}
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
                            <label className="block text-sm font-medium">
                                User Name<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("username")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.username && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.username.message} */}
                                    {typeof errors.username.message === 'string' ? errors.username.message : 'User Name is required!'}
                                </span>
                            )}
                        </div>

                        {/* Checkbox Password */}
                        <div className="mb-4 flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="editPassword"
                                checked={isEditPassword}
                                className="accent-lamaYellow"
                                onChange={(e) => setIsEditPassword(e.target.checked)}
                            />
                            <label htmlFor="editPassword" className="text-sm font-medium">
                                Edit Password
                            </label>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Password<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("password")}
                                type="password"
                                className="w-full p-2 border rounded disabled:bg-gray-200"
                                disabled={!isEditPassword}
                            />
                            {errors.password && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.password.message} */}
                                    {typeof errors.password.message === 'string' ? errors.password.message : 'Password must be at least 4 characters!'}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Confirm Password<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("confirmPassword")}
                                type="password"
                                className="w-full p-2 border rounded disabled:bg-gray-200"
                                disabled={!isEditPassword}
                            />
                            {errors.confirmPassword && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.confirmPassword.message} */}
                                    {typeof errors.confirmPassword.message === 'string' ? errors.confirmPassword.message : 'Confirm Password must be at least 4 characters!'}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">First Name</label>
                            <input
                                {...register("firstName")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.firstName && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.firstName.message} */}
                                    {typeof errors.firstName.message === 'string' ? errors.firstName.message : 'First Name is required!'}
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
                                    {/* {errors.lastName.message} */}
                                    {typeof errors.lastName.message === 'string' ? errors.lastName.message : 'Last Name is required!'}
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
                                    {/* {errors.email.message} */}
                                    {typeof errors.email.message === 'string' ? errors.email.message : 'Email is required!'}
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
                                {Object.values(UserSex).map((sex) => (
                                    <option key={sex} value={sex}>
                                        {sex.charAt(0) + sex.substring(1).toLocaleLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.sex && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.sex.message} */}
                                    {typeof errors.sex.message === 'string' ? errors.sex.message : 'Sex is required!'}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Role</label>
                            <select
                                {...register("role")}
                                className="w-full p-2 border rounded"
                                disabled={isCurrentUser || false}
                            >
                                {Object.values(UserRole).map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0) + role.substring(1).toLocaleLowerCase()}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <span className="text-red-500 text-sm">
                                    {/* {errors.role.message} */}
                                    {typeof errors.role.message === 'string' ? errors.role.message : 'Role is required!'}
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

export default EditUserPage;
