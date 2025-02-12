import type { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
    } & DefaultSession['user']
  }
}

export const authConfig: AuthOptions = {
    pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) return null

        const { email, password } = parsedCredentials.data
        if (email === "admin@example.com" && password === "password123") {
          return { 
            id: "1", 
            email: "admin@example.com", 
            name: "Admin",
            role: "admin"
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  }
} 