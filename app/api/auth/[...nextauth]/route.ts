import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getEM } from '@/lib/db'
import { compare } from 'bcryptjs'
import { User } from '@/lib/db/entities'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials')
          return null
        }

        try {
          const em = await getEM()
          const user = await em.findOne(User, { email: credentials.email })

          console.log('Found user:', user)

          if (!user) {
            console.log('User not found')
            return null
          }

          const passwordMatch = await compare(credentials.password, user.passwordHash)
          console.log('Password match:', passwordMatch)

          if (!passwordMatch) {
            console.log('Password does not match')
            return null
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST } 