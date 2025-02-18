import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { withDatabase } from '@/lib/db/connection'
import { User } from '@/lib/db/entities'
import bcrypt from 'bcryptjs'

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          return await withDatabase(async (orm) => {
            const em = orm.em.fork()
            const user = await em.findOne(User, { email: credentials.email })
            
            if (!user || !user.passwordHash) {
              return null
            }

            const isValid = await bcrypt.compare(credentials.password, user.passwordHash)
            if (!isValid) {
              return null
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
            }
          })
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
  session: {
    strategy: 'jwt'
  }
} 