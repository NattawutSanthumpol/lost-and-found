"use client";

import { LostItemSchema, lostItemSchema } from "@/lib/formValidationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import {
    createLostItem,
    getAllItemType,
    getAllStudent,
    getAllTeacher,
} from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { ItemType, LostStatus, Student, Teacher } from "@prisma/client";
import { useSession } from "next-auth/react";
import Select from "react-select";

const CreateLostItemPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [image, setImage] = useState<string>("");

    const [itemTypes, setItemTypes] = useState<{ value: number; label: string }[]>([]);
    const [teachers, setTeachers] = useState<{ value: number; label: string }[]>([]);
    const [students, setStudents] = useState<{ value: number; label: string }[]>([]);

    const { data: session, status } = useSession();
    const currentId =
        status === "authenticated" && session?.user.id
            ? parseInt(session.user.id)
            : 0;

    useEffect(() => {
        const fetchItemType = async () => {
            try {
                const getItemTypes: ItemType[] | null = await getAllItemType();
                if (getItemTypes !== null) {
                    setItemTypes(
                        getItemTypes?.map((val) => ({
                            value: val.id,
                            label: `${val.typeName}`,
                        }))
                    );
                }
            } catch (error) {
                toast.error(`Failed to fetch item type : ${error}`);
            }
        };

        const fetchTeachers = async () => {
            try {
                const getTeachers: Teacher[] | null = await getAllTeacher();
                if (getTeachers !== null) {
                    setTeachers(
                        getTeachers.map((teacher) => ({
                            value: teacher.id,
                            label: `${teacher.firstName} ${teacher.lastName}`,
                        }))
                    );
                }
            } catch (error) {
                toast.error(`Failed to fetch item type : ${error}`);
            }
        };

        const fetchStudents = async () => {
            try {
                const getStudents: Student[] | null = await getAllStudent();
                if (getStudents !== null) {
                    setStudents(getStudents.map((student) => ({
                        value: student.id,
                        label: `${student.firstName} ${student.lastName}`
                    })));
                }
            } catch (error) {
                toast.error(`Failed to fetch item type : ${error}`);
            }
        };

        fetchItemType();
        fetchTeachers();
        fetchStudents();
    }, []);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm<LostItemSchema>({
        resolver: zodResolver(lostItemSchema),
    });

    // const formValues = watch();
    // console.log(formValues);

    const onSubmit = async (data: LostItemSchema) => {
        console.log(data);
        setIsSubmitting(true);
        const result = await createLostItem({
            ...data,
            img: image,
            userId: currentId,
        });
        // console.log("result => ", result);
        setIsSubmitting(false);

        if (result.success) {
            toast.success("Lost Item created successfully!");
            router.push("/admin/lostItems");
            router.refresh();
        } else if (result.error) {
            toast.error(result.message);
        } else {
            toast.error("Failed to create lostItem. Please try again.");
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
            } else {
                toast.error("Please select an image file.");
            }
        }
    };

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="container mx-auto p-4">
                {/* Header */}
                <h1 className="text-center text-3xl font-bold mb-6">
                    Create a new lost item
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
                            <label className="block text-sm font-medium">
                                Item Name<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("itemName")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.itemName && (
                                <span className="text-red-500 text-sm">
                                    {errors.itemName.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Description
                            </label>
                            <input
                                {...register("description")}
                                type="description"
                                className="w-full p-2 border rounded"
                            />
                            {/* {errors.description && (
                                <span className="text-red-500 text-sm">
                                    {errors.description.message}
                                </span>
                            )} */}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Item Type<span className="text-red-600 text-lg">*</span>
                            </label>
                            {/* <select
                                {...register("itemTypeId")}
                                className="w-full p-2 border rounded"
                            >
                                {itemTypes === null ? (
                                    <option value="">Please select....</option>
                                ) : (
                                    Object.values(itemTypes).map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.typeName}
                                        </option>
                                    ))
                                )}
                            </select> */}
                            <Controller
                                name="itemTypeId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={itemTypes}
                                        value={itemTypes.find(option => option.value === field.value)}
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption?.value)
                                        }
                                        placeholder="Select a item type..."
                                        isClearable
                                    />
                                )}
                            />
                            {errors.itemTypeId && (
                                <span className="text-red-500 text-sm">
                                    {errors.itemTypeId.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Location<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("location")}
                                className="w-full p-2 border rounded"
                            />
                            {errors.location && (
                                <span className="text-red-500 text-sm">
                                    {errors.location.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Found Date<span className="text-red-600 text-lg">*</span>
                            </label>
                            <input
                                {...register("foundDate")}
                                className="w-full p-2 border rounded"
                                type="date"
                                defaultValue={new Date().toISOString().split("T")[0]}
                            />
                            {errors.foundDate && (
                                <span className="text-red-500 text-sm">
                                    {errors.foundDate.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Status<span className="text-red-600 text-lg">*</span>
                            </label>
                            {/* <input
                                type="status"
                                {...register("status")}
                                className="w-full p-2 border rounded"
                            /> */}
                            <select
                                {...register("status")}
                                className="w-full p-2 border rounded"
                            >
                                <option value={LostStatus.FOUND}>{LostStatus.FOUND}</option>
                            </select>
                            {errors.status && (
                                <span className="text-red-500 text-sm">
                                    {errors.status.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Student</label>
                            {/* <select
                                {...register("studentId")}
                                className="w-full p-2 border rounded"
                            >
                                {students === null ? (
                                    <option value="">Please select....</option>
                                ) : (
                                    Object.values(students).map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.firstName} {val.lastName}
                                        </option>
                                    ))
                                )}
                                
                            </select> */}
                            <Controller
                                name="studentId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={students}
                                        value={students.find(option => option.value === field.value)}
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption?.value)
                                        }
                                        placeholder="Select a student..."
                                        isClearable
                                    />
                                )}
                            />

                            {errors.studentId && (
                                <span className="text-red-500 text-sm">
                                    {errors.studentId.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium">Teacher</label>
                            {/* <select
                                {...register("teacherId")}
                                className="w-full p-2 border rounded"
                            >
                                {teachers === null ? (
                                    <option value="">Please select....</option>
                                ) : (
                                    Object.values(teachers).map((val) => (
                                        <option key={val.id} value={val.id}>
                                            {val.firstName} {val.lastName}
                                        </option>
                                    ))
                                )}
                            </select> */}
                            <Controller
                                name="teacherId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={teachers}
                                        value={teachers.find(option => option.value === field.value)}
                                        onChange={(selectedOption) =>
                                            field.onChange(selectedOption?.value)
                                        }
                                        placeholder="Select a teacher..."
                                        isClearable
                                    />
                                )}
                            />

                            {errors.teacherId && (
                                <span className="text-red-500 text-sm">
                                    {errors.teacherId.message}
                                </span>
                            )}
                        </div>

                        <div className="mb-4 hidden">
                            <label className="block text-sm font-medium">
                                Create By<span className="text-red-600 text-lg">*</span>
                            </label>

                            <input
                                type="number"
                                {...register("userId")}
                                defaultValue={currentId} 
                                className="w-full p-2 border rounded"
                            />

                        </div>
                            {errors.userId && (
                                <span className="text-red-500 text-sm">
                                    {errors.userId.message}
                                </span>
                            )}

                        <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-2">
                            <button
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-blue-400 px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Saving..." : "Create"}
                            </button>
                            <Link href={`/admin/lostItems`}>
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

export default CreateLostItemPage;
