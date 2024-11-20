/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcryptjs";
import { LostStatus, PrismaClient, UserRole, UserSex } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ItemType
  for (let i = 1; i <= 3; i++) {
    await prisma.itemType.create({
      data: {
        typeName: `ItemType${i}`,
      },
    });
  }

  // User Admin
  await prisma.user.create({
    data: {
      username: "admin",
      password: saltAndHashPassword("admin"),
      firstName: "Admin",
      lastName: "LastName",
      email: "admin@mail.com",
      phone: "0811111111",
      sex: UserSex.MALE,
      img: "/images/user/admin.jpeg",
      role: UserRole.ADMIN,
    },
  });

  // User Teacher
  await prisma.user.create({
    data: {
      username: "teacher",
      password: saltAndHashPassword("teacher"),
      firstName: "Teacher",
      lastName: "LastTeacher",
      email: "teacher@mail.com",
      phone: "0822222222",
      sex: UserSex.FEMALE,
      img: "/images/user/admin1.jpeg",
      role: UserRole.TEACHER,
    },
  });

  // Teachers
  for (let i = 1; i <= 10; i++) {
    const phoneNumber = `081111111${i}`.padEnd(10, '0'); // ใช้ padEnd เพื่อให้เป็น 10 หลัก

    await prisma.teacher.create({
      data: {
        firstName: `TeacherFName${i}`,
        lastName: `TeacherLName${i}`,
        email: `teacher${i}@mail.com`,
        phone: phoneNumber,
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        img:
          i % 2 === 0
            ? "/images/teacher/teacher1.jpeg"
            : "/images/teacher/teacher2.jpeg",
      },
    });
  }

  // Students
  for (let i = 1; i <= 30; i++) {
    const phoneNumber = `081111111${i}`.padEnd(10, '0'); // ใช้ padEnd เพื่อให้เป็น 10 หลัก
    await prisma.student.create({
      data: {
        firstName: `StudentFName${i}`,
        lastName: `StudentLName${i}`,
        email: `student${i}@mail.com`,
        phone: phoneNumber,
        sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
        img:
          i % 2 === 0
            ? "/images/student/student1.jpeg"
            : "/images/student/student2.jpeg",
      },
    });
  }

  // LostItem
  for (let i = 1; i <= 6; i++) {
    await prisma.lostItem.create({
      data: {
        itemName: `ItemName${i}`,
        description: `Description of ItemName${i}`,
        itemTypeId: Math.floor(Math.random() * 3) + 1,
        location: `Location${i}`,
        foundDate: new Date(),
        status: LostStatus.FOUND,
        img: "/images/imageFound.png",
        studentId: Math.floor(Math.random() * 30) + 1,
        teacherId: Math.floor(Math.random() * 10) + 1,
        userId: Math.floor(Math.random() * 2) + 1, // Assign to Admin user
      },
    });
  }

  console.log("Seeding completed successfully.");
}

function saltAndHashPassword(password: any) {
  const saltRounds = 10; // Adjust the cost factor according to your security requirements
  const salt = bcrypt.genSaltSync(saltRounds); // Synchronously generate a salt
  const hash = bcrypt.hashSync(password, salt); // Synchronously hash the password
  return hash; // Return the hash directly as a string
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
