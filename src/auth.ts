import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";

declare module "next-auth" {
  interface User {
    role: string;
    userName: string;
  }

  interface Session {
    user: {
      role: string;
      userName: string;
    } & User;
  }
}

declare module "@auth/core" {
  interface User {
    role: string;
    userName: string;
  }
}

declare module "@auth/core/types" {
  interface User {
    role: string;
    userName: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  jwt: { maxAge: 8 * 60 * 60 },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "UserName", type: "text", placeholder: "UserName" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.username || !credentials.password) {
          return null;
        }

        const currentUser: any = await prisma.user.findUnique({
          where: {
            username: credentials.username as string,
          },
        });
        // console.log("currentUser => ", currentUser);

        const isMatch = bcrypt.compareSync(
          credentials.password as string,
          currentUser.password
        );

        // console.log("isMatch => ", isMatch);

        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        if (currentUser && isMatch) {
          return {
            id: currentUser.id,
            name: `${currentUser.firstName} ${currentUser.lastName}`,
            email: currentUser.email,
            role: currentUser.role,
            userName: currentUser.username,
            image: currentUser.img,
          };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userName = user.userName;
        token.image = user.image;
      }

      return token;
    },
    session: async ({ session, token, user }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.userName = token.userName as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
});
