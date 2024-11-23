import { z } from "zod";

export const teacherSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d*$/, { message: "Phone number must contain only numbers!" })
    .optional(),
  img: z.string().optional(),
  // img: z
  //   .optional(z.instanceof(File)) // img เป็น File หรือ undefined
  //   .refine((file) => !file || file.size <= 15 * 1024 * 1024, {
  //     message: "Image size should not exceed 15MB",
  //   }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
});

export const studentSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z
    .string()
    .email({ message: "Invalid email address!" })
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^\d*$/, { message: "Phone number must contain only numbers!" })
    .optional(),
  img: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
});

export const itemTypeSchema = z.object({
  typeName: z.string().min(1, { message: "Item Type is required!" }),
});

export const lostItemSchema = z.object({
  itemName: z.string().min(1, { message: "Item Name is required!" }),
  description: z.string().optional(),
  itemTypeId: z.number().min(1, { message: "Item Type ID is required!" }),
  location: z.string().min(1, { message: "Location is required!" }),
  foundDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: "Found Date must be a valid date!",
  }),
  status: z.enum(["FOUND", "RETURNED"], { message: "Status is required!" }),
  img: z.string().min(1, { message: "Image URL is required!" }),
  studentId: z.number().min(1, { message: "Student ID is required!" }),
  teacherId: z
    .number()
    .min(1, { message: "Teacher ID is required if applicable!" }),
  userId: z.number().min(1, { message: "User ID is required!" }),
});

export const userSchema = z
  .object({
    username: z.string().min(1, { message: "User Name is required!" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters!" }),
    confirmPassword: z
      .string()
      .min(4, { message: "Confirm Password must be at least 4 characters" }),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
      .string()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^\d*$/, { message: "Phone number must contain only numbers!" })
      .optional(),
    img: z.string().optional(),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    role: z.enum(["ADMIN", "TEACHER"], { message: "Role is required!" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });

export const updateUserSchema = z
  .object({
    username: z.string().min(1, { message: "User Name is required!" }),
    password: z.string().min(4, { message: "Password must be at least 4 characters!" }).optional(),
    confirmPassword: z
      .string()
      .min(4, { message: "Confirm Password must be at least 4 characters" }).optional(),
    firstName: z.string().min(1, { message: "First name is required!" }),
    lastName: z.string().min(1, { message: "Last name is required!" }),
    email: z
      .string()
      .email({ message: "Invalid email address!" })
      .optional()
      .or(z.literal("")),
    phone: z
      .string()
      .regex(/^\d*$/, { message: "Phone number must contain only numbers!" })
      .optional(),
    img: z.string().optional(),
    sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
    role: z.enum(["ADMIN", "TEACHER"], { message: "Role is required!" }),
  })
  .refine((data) => data.password || data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });

export type TeacherSchema = z.infer<typeof teacherSchema>;
export type StudentSchema = z.infer<typeof studentSchema>;
export type ItemTypeSchema = z.infer<typeof itemTypeSchema>;
export type LostItemSchema = z.infer<typeof lostItemSchema>;
export type UserSchema = z.infer<typeof userSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
