import { db } from "@/lib/db";
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'

export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" },
            },
            async authorize(credentials: any) {
                try {
                    const user:any = await db.user.findUnique({
                        where: { email: credentials.email }
                    })
                    if (user) {
                        const passCompare = await bcrypt.compare(credentials.password, user.password)
                        if (passCompare) {
                            return user
                        } else {
                            throw new Error("Invalid Credential")
                        }
                    } else {
                        throw new Error('Email not registered')
                    }
                } catch (error: any) {
                    throw new Error(error.message)
                }

            }
        })
    ]
}

export const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }