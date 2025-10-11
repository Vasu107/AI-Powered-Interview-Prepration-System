import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGO_URI)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || 'dummy',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        try {
          await client.connect()
          const db = client.db('AskUp_Virtual_Interview')
          const user = await db.collection('users').findOne({ email: credentials.email })
          
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === 'google' || account.provider === 'github') {
        try {
          await client.connect()
          const db = client.db('AskUp_Virtual_Interview')
          
          const existingUser = await db.collection('users').findOne({ email: user.email })
          if (!existingUser) {
            await db.collection('users').insertOne({
              name: user.name,
              email: user.email,
              password: '', // OAuth users don't need password
              createdAt: new Date(),
              updatedAt: new Date()
            })
          }
        } catch (error) {
          console.error('Error creating user:', error)
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`
      if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret'
})

export { handler as GET, handler as POST }