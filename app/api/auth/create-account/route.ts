import { db } from '@/lib/db'
import { NextResponse, NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

interface RequestBody {
    email: string;
    password: string;
    name: string;
}

export async function POST(req: NextRequest) {
    try {
        const { email, password, name }: RequestBody = await req.json()

        if (!email || !password || !name || name.length < 3 || password.length < 8) {
            return NextResponse.json({ success: false, status: 400, message: "Invaild Input" })
        }
        const user = await db.user.findUnique({
            where: {
                email,
            },
        })
        if (user) {
            return NextResponse.json({ success: false, status: 400, message: "Email already registred" })
        }
        const check = await db.column.findMany()
        console.log(check)
        const salt = await bcrypt.genSalt(10)
        const securePass = await bcrypt.hash(password, salt);
        await db.user.create({
            data:
            {
                name,
                email,
                password: securePass
            }
        })
        return NextResponse.json({ success: true, message: "Account created", status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: error.message, status: 500, success: false })
    }

}   