/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import path from "path";
import {
  ItemTypeSchema,
  LostItemSchema,
  StudentSchema,
  TeacherSchema,
  UpdateUserSchema,
  UserSchema,
} from "./formValidationSchemas";

import { mkdir, unlink, writeFile } from "fs/promises";
import { promises as fs } from "fs";
import { ItemType, LostItem, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { error } from "console";
import { saltAndHashPassword, verifyPassword } from "./helper";
import { AuthError } from "next-auth";
import { signIn, signOut } from "../auth";
import prisma from "./prisma";
// import { prisma } from "@/lib/prisma";

// type CurrentState = { success: boolean; error: boolean };

////////////////////////////////////////////////////// Teacher //////////////////////////////////////////////////////
export const createTeacher = async (data: TeacherSchema) => {
  try {
    //Image
    if (!data.img) {
      data.img = "/images/other/noAvatar.png";
    } else {
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `teacher_${timestamp}.${fileExtension}`; // Construct new filename
      const filePath = `/uploads/teacher/${filename}`;

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/teacher");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      data.img = filePath;
    }

    // Insert to db
    await prisma.teacher.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        sex: data.sex,
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to create teacher. Error: ${err}`,
    };
  }
};

export const getTeacherById = async (id: number) => {
  if (!id) {
    return null;
  }
  try {
    const result = await prisma.teacher.findUnique({ where: { id: id } });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateTeacher = async (data: TeacherSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    //Image
    let imagePath = data.img;
    const imgInData = await prisma.teacher.findUnique({ where: { id } });

    // Check Image in Folder
    if (data.img === imgInData?.img && data.img) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "teacher",
        path.basename(data.img)
      );

      try {
        await fs.access(filePath);
      } catch (err: unknown) {
        // use default image
        imagePath = "/images/other/noAvatar.png";
      }
    } else if (data.img !== imgInData?.img && data.img) {
      // Delete Old Image
      if (imgInData?.img && imgInData?.img !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imgInData?.img);
        console.log("imgInData => ", imgInData?.img);

        try {
          console.log("New Upload =>", filePath);
          await fs.access(filePath);
          await unlink(filePath);
        } catch (err) {
          console.error("Error : ", err);
        }
      }

      // New Upload Image
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `teacher_${timestamp}.${fileExtension}`; // Construct new filename
      const newFilePath = `/uploads/teacher/${filename}`;
      console.log("newFilePath => ", newFilePath);

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/teacher");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      imagePath = newFilePath;
    } else {
      // use default image
      imagePath = "/images/other/noAvatar.png";
    }

    // Update Data
    await prisma.teacher.update({
      where: {
        id: id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: imagePath || null,
        sex: data.sex,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    // หากไม่พบข้อผิดพลาดจาก Prisma หรือไม่สามารถจับข้อผิดพลาดได้
    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to update teacher. Error: ${err}`,
    };
  }
};

export const deleteTeacher = async (data: FormData) => {
  const id = data.get("id");

  // ตรวจสอบว่าค่า id เป็น null หรือไม่
  if (!id || isNaN(Number(id))) {
    return { success: false, error: true };
  }

  try {
    const imgFile = await prisma.teacher.findUnique({
      where: { id: Number(id) },
      select: { img: true },
    });

    if (imgFile) {
      // ถ้ามีรูปภาพในฟิลด์ img
      const imagePath = imgFile.img;

      if (imagePath && imagePath !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imagePath);

        // ลบไฟล์รูปภาพ
        await unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    }

    await prisma.teacher.delete({
      where: {
        id: Number(id),
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to delete teacher. Error: ${err}`,
    };
  }
};

////////////////////////////////////////////////////// End Teacher //////////////////////////////////////////////////////

////////////////////////////////////////////////////// Student //////////////////////////////////////////////////////
export const createStudent = async (data: StudentSchema) => {
  try {
    //Image
    if (!data.img) {
      data.img = "/images/other/noAvatar.png";
    } else {
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `student_${timestamp}.${fileExtension}`; // Construct new filename
      const filePath = `/uploads/student/${filename}`;

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/student");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      data.img = filePath;
    }

    // Insert to db
    await prisma.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        sex: data.sex,
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to create student. Error: ${err}`,
    };
  }
};

export const getStudentById = async (id: number) => {
  if (!id) {
    return null;
  }
  try {
    const result = await prisma.student.findUnique({ where: { id: id } });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateStudent = async (data: StudentSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    //Image
    let imagePath = data.img;
    const imgInData = await prisma.student.findUnique({ where: { id } });

    // Check Image in Folder
    if (data.img === imgInData?.img && data.img) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "student",
        path.basename(data.img)
      );

      try {
        await fs.access(filePath);
      } catch (err: unknown) {
        // use default image
        imagePath = "/images/other/noAvatar.png";
      }
    } else if (data.img !== imgInData?.img && data.img) {
      // Delete Old Image
      if (imgInData?.img && imgInData?.img !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imgInData?.img);
        console.log("imgInData => ", imgInData?.img);

        try {
          console.log("New Upload =>", filePath);
          await fs.access(filePath);
          await unlink(filePath);
        } catch (err) {
          console.error("Error : ", err);
        }
      }

      // New Upload Image
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `student_${timestamp}.${fileExtension}`; // Construct new filename
      const newFilePath = `/uploads/student/${filename}`;
      console.log("newFilePath => ", newFilePath);

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/student");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      imagePath = newFilePath;
    } else {
      // use default image
      imagePath = "/images/other/noAvatar.png";
    }

    // Update Data
    await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: imagePath || null,
        sex: data.sex,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    // หากไม่พบข้อผิดพลาดจาก Prisma หรือไม่สามารถจับข้อผิดพลาดได้
    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to update student. Error: ${err}`,
    };
  }
};

export const deleteStudent = async (data: FormData) => {
  const id = data.get("id");

  // ตรวจสอบว่าค่า id เป็น null หรือไม่
  if (!id || isNaN(Number(id))) {
    return { success: false, error: true };
  }

  try {
    const imgFile = await prisma.student.findUnique({
      where: { id: Number(id) },
      select: { img: true },
    });

    if (imgFile) {
      // ถ้ามีรูปภาพในฟิลด์ img
      const imagePath = imgFile.img;

      if (imagePath && imagePath !== "/images/other/noAvatar.png") {
        // สร้าง path ของไฟล์จาก base URL ของการอัปโหลด
        const filePath = path.join(process.cwd(), "public", imagePath);

        // ลบไฟล์รูปภาพ
        await unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    }

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to delete student. Error: ${err}`,
    };
  }
};

////////////////////////////////////////////////////// End Student //////////////////////////////////////////////////////

////////////////////////////////////////////////////// Item Type //////////////////////////////////////////////////////
export const createItemType = async (data: ItemTypeSchema) => {
  try {
    // Insert to db
    await prisma.itemType.create({
      data: {
        typeName: data.typeName,
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to create Item Type. Error: ${err}`,
    };
  }
};

export const getItemTypeById = async (id: number) => {
  if (!id) {
    return null;
  }
  try {
    const result = await prisma.itemType.findUnique({ where: { id: id } });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateItemType = async (data: ItemTypeSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    // Update Data
    await prisma.itemType.update({
      where: {
        id: id,
      },
      data: {
        typeName: data.typeName,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to update item type. Error: ${err}`,
    };
  }
};

export const deleteItemType = async (data: FormData) => {
  const id = data.get("id");

  // ตรวจสอบว่าค่า id เป็น null หรือไม่
  if (!id || isNaN(Number(id))) {
    return { success: false, error: true };
  }

  try {
    const imgFile = await prisma.itemType.findUnique({
      where: { id: Number(id) },
    });

    await prisma.itemType.delete({
      where: {
        id: Number(id),
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to delete item type. Error: ${err}`,
    };
  }
};

////////////////////////////////////////////////////// End Item Type //////////////////////////////////////////////////////

////////////////////////////////////////////////////// Lost Item //////////////////////////////////////////////////////
export const createLostItem = async (data: LostItemSchema) => {
  try {
    //Image
    if (!data.img) {
      data.img = "/images/other/noAvatar.png";
    } else {
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `lostItem_${timestamp}.${fileExtension}`; // Construct new filename
      const filePath = `/uploads/lostItem/${filename}`;

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/lostItem");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      data.img = filePath;
    }

    // Insert to db
    await prisma.lostItem.create({
      data: {
        itemName: data.itemName,
        description: data.description,
        itemTypeId: data.itemTypeId,
        location: data.location,
        foundDate: data.foundDate,
        status: data.status,
        img: data.img,
        studentId: data.studentId,
        teacherId: data.teacherId,
        userId: data.userId,
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to create lost item. Error: ${err}`,
    };
  }
};

export const getLostItemById = async (id: number) => {
  if (!id) {
    return null;
  }
  try {
    const result = await prisma.lostItem.findUnique({ where: { id: id } });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateLostItem = async (data: LostItemSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    //Image
    let imagePath = data.img;
    const imgInData = await prisma.lostItem.findUnique({ where: { id } });

    // Check Image in Folder
    if (data.img === imgInData?.img && data.img) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "lostItem",
        path.basename(data.img)
      );

      try {
        await fs.access(filePath);
      } catch (err: unknown) {
        // use default image
        imagePath = "/images/other/noAvatar.png";
      }
    } else if (data.img !== imgInData?.img && data.img) {
      // Delete Old Image
      if (imgInData?.img && imgInData?.img !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imgInData?.img);
        console.log("imgInData => ", imgInData?.img);

        try {
          console.log("New Upload =>", filePath);
          await fs.access(filePath);
          await unlink(filePath);
        } catch (err) {
          console.error("Error : ", err);
        }
      }

      // New Upload Image
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `lostItem_${timestamp}.${fileExtension}`; // Construct new filename
      const newFilePath = `/uploads/lostItem/${filename}`;
      console.log("newFilePath => ", newFilePath);

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/lostItem");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      imagePath = newFilePath;
    } else {
      // use default image
      imagePath = "/images/other/noAvatar.png";
    }

    // Update Data
    await prisma.lostItem.update({
      where: {
        id: id,
      },
      data: {
        itemName: data.itemName,
        description: data.description,
        itemTypeId: data.itemTypeId,
        location: data.location,
        foundDate: data.foundDate,
        status: data.status,
        img: imagePath,
        studentId: data.studentId,
        teacherId: data.teacherId,
        userId: data.userId,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to update lost item. Error: ${err}`,
    };
  }
};

export const deleteLostItem = async (data: FormData) => {
  const id = data.get("id");

  // ตรวจสอบว่าค่า id เป็น null หรือไม่
  if (!id || isNaN(Number(id))) {
    return { success: false, error: true };
  }

  try {
    const imgFile = await prisma.lostItem.findUnique({
      where: { id: Number(id) },
      select: { img: true },
    });

    if (imgFile) {
      // ถ้ามีรูปภาพในฟิลด์ img
      const imagePath = imgFile.img;

      if (imagePath && imagePath !== "/images/other/noAvatar.png") {
        // สร้าง path ของไฟล์จาก base URL ของการอัปโหลด
        const filePath = path.join(process.cwd(), "public", imagePath);

        // ลบไฟล์รูปภาพ
        await unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    }

    await prisma.lostItem.delete({
      where: {
        id: Number(id),
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to delete lost item. Error: ${err}`,
    };
  }
};

////////////////////////////////////////////////////// End Lost Item //////////////////////////////////////////////////////

////////////////////////////////////////////////////// Users //////////////////////////////////////////////////////
export const logIn = async (formData: FormData) => {
  const rawLogIn = {
    username: formData.get("userName"),
    password: formData.get("password"),
    redirectTo: "/", // /admin/dashboard
  };

  try {
    // Get User
    const existingUser = await prisma.user.findUnique({
      where: { username: rawLogIn.username as string },
    });

    // console.log("existingUser => ", existingUser);

    // Check User
    if (existingUser === null) {
      return { error: "Invalid username or password" };
    }

    // Check Password
    if (!verifyPassword(rawLogIn.password, existingUser.password)) {
      return { error: "Invalid username or password" };
    }
    // console.log("Check Password Pass");

    const loginResult = await signIn("credentials", {
      redirect: false,
      username: rawLogIn.username,
      password: rawLogIn.password,
    });
    console.log("loginResult => ", loginResult);
    if (!loginResult) {
      return { error: "Invalid username or password" };
    }
  } catch (err: any) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: `${error.type}` };
      }
    } else {
      return { error: `${err}` };
      // throw {error: `${err}`}
    }
  }
  // revalidatePath("/");
};

export const logOut = async () => {
  await signOut({ redirectTo: "/login" });
  // revalidatePath("/login");
};

export const createUser = async (data: UserSchema) => {
  try {
    //Image
    if (!data.img) {
      data.img = "/images/other/noAvatar.png";
    } else {
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `user_${timestamp}.${fileExtension}`; // Construct new filename
      const filePath = `/uploads/user/${filename}`;

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/user");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      data.img = filePath;
    }

    // Insert to db
    await prisma.user.create({
      data: {
        username: data.username,
        password: saltAndHashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        sex: data.sex,
        role: data.role,
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to create user. Error: ${err}`,
    };
  }
};

export const getUserById = async (id: number) => {
  if (!id) {
    return null;
  }
  try {
    const result = await prisma.user.findUnique({ where: { id: id } });

    if (!result) {
      return null;
    }

    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateUser = async (data: UserSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    //Image
    let imagePath = data.img;
    const imgInData = await prisma.user.findUnique({ where: { id } });

    // Check Image in Folder
    if (data.img === imgInData?.img && data.img) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "user",
        path.basename(data.img)
      );

      try {
        await fs.access(filePath);
      } catch (err: unknown) {
        // use default image
        imagePath = "/images/other/noAvatar.png";
      }
    } else if (data.img !== imgInData?.img && data.img) {
      // Delete Old Image
      if (imgInData?.img && imgInData?.img !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imgInData?.img);

        try {
          await fs.access(filePath);
          await unlink(filePath);
        } catch (err) {
          console.error("Error : ", err);
        }
      }

      // New Upload Image
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `user_${timestamp}.${fileExtension}`; // Construct new filename
      const newFilePath = `/uploads/user/${filename}`;
      console.log("newFilePath => ", newFilePath);

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/user");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      imagePath = newFilePath;
    } else {
      // use default image
      imagePath = "/images/other/noAvatar.png";
    }

    // Update Data
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: data.username,
        password: saltAndHashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        sex: data.sex,
        role: data.role,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    // หากไม่พบข้อผิดพลาดจาก Prisma หรือไม่สามารถจับข้อผิดพลาดได้
    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to update user. Error: ${err}`,
    };
  }
};

export const updateUserNonPassword = async (data: UpdateUserSchema, id: number) => {
  if (!id) {
    return { success: false, error: true };
  }

  try {
    //Image
    let imagePath = data.img;
    const imgInData = await prisma.user.findUnique({ where: { id } });

    // Check Image in Folder
    if (data.img === imgInData?.img && data.img) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "user",
        path.basename(data.img)
      );

      try {
        await fs.access(filePath);
      } catch (err: unknown) {
        // use default image
        imagePath = "/images/other/noAvatar.png";
      }
    } else if (data.img !== imgInData?.img && data.img) {
      // Delete Old Image
      if (imgInData?.img && imgInData?.img !== "/images/other/noAvatar.png") {
        const filePath = path.join(process.cwd(), "public", imgInData?.img);

        try {
          await fs.access(filePath);
          await unlink(filePath);
        } catch (err) {
          console.error("Error : ", err);
        }
      }

      // New Upload Image
      // Convert the file data to a Buffer
      const base64Data = data.img.split(",")[1];

      const buffer = Buffer.from(base64Data, "base64");
      // Replace spaces in the file name with underscores
      const timestamp = Date.now();

      // Check the file type from the base64 header
      const mimeType = data.img.split(";")[0].split(":")[1]; // e.g., "image/png"
      const fileExtension = mimeType.split("/")[1]; // e.g., "png"
      const filename = `user_${timestamp}.${fileExtension}`; // Construct new filename
      const newFilePath = `/uploads/user/${filename}`;
      console.log("newFilePath => ", newFilePath);

      // Ensure the uploads directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads/user");
      await mkdir(uploadDir, { recursive: true });

      // Write the file to the specified directory (public/uploads) with the modified filename
      await writeFile(path.join(uploadDir, filename), buffer);

      imagePath = newFilePath;
    } else {
      // use default image
      imagePath = "/images/other/noAvatar.png";
    }

    // Update Data
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || null,
        phone: data.phone || null,
        img: data.img || null,
        sex: data.sex,
        role: data.role,
      },
    });
    return { success: true, error: false };
  } catch (err: unknown) {
    // ตรวจจับข้อผิดพลาดจาก Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // ตรวจสอบว่า err.meta และ err.meta.target มีค่า
      if (err.meta && Array.isArray(err.meta.target)) {
        // เมื่อรู้ว่า err.meta.target เป็น array, เราสามารถเข้าถึงได้
        if (err.meta.target.includes("email")) {
          return {
            success: false,
            error: true,
            message: "Email is already taken!",
          };
        } else if (err.meta.target.includes("phone")) {
          return {
            success: false,
            error: true,
            message: "Phone number is already taken!",
          };
        }
      }
    }

    // หากไม่พบข้อผิดพลาดจาก Prisma หรือไม่สามารถจับข้อผิดพลาดได้
    console.log("Unexpected error:", err);
    return {
      success: false,
      error: true,
      message: `Failed to update user non password. Error: ${err}`,
    };
  }
};

export const deleteUser = async (data: FormData) => {
  const id = data.get("id");

  // ตรวจสอบว่าค่า id เป็น null หรือไม่
  if (!id || isNaN(Number(id))) {
    return { success: false, error: true };
  }

  try {
    const imgFile = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { img: true },
    });

    if (imgFile) {
      // ถ้ามีรูปภาพในฟิลด์ img
      const imagePath = imgFile.img;

      if (imagePath && imagePath !== "/images/other/noAvatar.png") {
        // สร้าง path ของไฟล์จาก base URL ของการอัปโหลด
        const filePath = path.join(process.cwd(), "public", imagePath);

        // ลบไฟล์รูปภาพ
        await unlink(filePath);
        console.log(`File deleted: ${filePath}`);
      }
    }

    await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    return { success: true, error: false };
  } catch (err: unknown) {
    return {
      success: false,
      error: true,
      message: `Failed to delete user. Error: ${err}`,
    };
  }
};
////////////////////////////////////////////////////// End Users //////////////////////////////////////////////////////
