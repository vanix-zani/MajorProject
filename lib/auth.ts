import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import connectToDatabase from "./db"
import User from "./models/user"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        await connectToDatabase()

        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          throw new Error("No user found with this email")
        }

        const isPasswordValid = await user.comparePassword(credentials.password)

        if (!isPasswordValid) {
          throw new Error("Invalid password")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          class: user.class,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.class = (user as any).class
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.class = token.class as number
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Extend next-auth types
declare module "next-auth" {
  interface User {
    id: string
    class?: number
    role?: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      class: number
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    class?: number
    role?: string
  }
}
