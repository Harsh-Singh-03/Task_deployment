"use server"

import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export const fetchUser = async () => {
    try {
        const session = await getServerSession()
        if (!session || !session.user || !session.user.email) {
            revalidatePath('/')
            return { success: false, message: "invalid request, session expired please relogin" }
        }
        const user = await db.user.findUnique({
            where: { email: session.user.email }
        })
        if (!user) { return { success: false, message: "session expired please relogin" } } else { return { user, success: true } }

    } catch (error: any) {
        console.log(error)
        return { success: false, message: error.message }
    }
}