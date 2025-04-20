"use server"
export const runtime = 'nodejs'

import { PRIORITY } from "@/lib/generated/prisma"
import { fetchUser } from "./user.action"
import { db } from "@/lib/db"

/** Create Column */
export const create_column = async (title: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return res
        const { user } = res
        
        const last_column = await db.column.findFirst({
            where: { userId: user.id },
            orderBy: { order: "desc" },
            select: { order: true },
        });
        const newOrder = last_column ? last_column.order + 1 : 1;
        await db.column.create({
            data: {
                title,
                order: newOrder,
                userId: user.id
            }
        })
        return { success: true, message: `Column "${title}" created!` }
    } catch (error) {
        console.log(error)
        return { success: false, message: "server error" }
    }
}

/** Update Column */
export const updateColumn = async ({ id, body }: { id: string, body: { title: string } }) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res

        const column = await db.column.findUnique({ where: { id: id } });
        if (!column) return { success: false, message: 'column not found' }

        if (column.userId !== user.id) {
            return { success: false, message: "Unauthorized access to update column" }
        }

        await db.column.update({
            where: { id },
            data: body
        })

        return { success: true, message: `Column "${body.title}" updated` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

/** Delete Column */
export const deleteColumn = async (id: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res
        const column = await db.column.findUnique({ where: { id: id } });
        if (!column) return { success: false, message: 'column not found' }

        if (column.userId !== user.id) {
            return { success: false, message: "Unauthorized access to update column" }
        }

        await db.column.delete({
            where: { id }
        })

        return { success: true, message: "Column Deleted Successfully"}

    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

interface reorderProps {
    columns: {
        id: string,
        order: number
    }[]
}

/** Reorder Column */
export const reorderColumn = async (obj: reorderProps) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }

        const transaction = obj.columns.map((item) =>
            db.column.update({
                where: { id: item.id },
                data: { order: item.order }
            })
        )

        await db.$transaction(transaction)
        return { success: true, message: "Column reorder successfully" }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

export const getColumnsTasks = async (priority?: PRIORITY | null) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const { user } = res

        let conditions: any = {}
        let and_clauses = []
         
        and_clauses.push({})

        if(priority) {
            and_clauses.push({priority})
        }

        conditions.AND = and_clauses
        

        const columns = await db.column.findMany({
            where: { userId: user.id },
            include: {
                tasks: {
                    where: conditions,
                    orderBy: {
                        order: "asc",
                    },
                },
            },
            orderBy: { order: "asc" },
        });

        if (!columns) return { success: false, message: 'not found' }
        return { success: true, message: 'success', data: columns }
    } catch (error) {
        console.log(error)
        return { success: false, message: "Server error try again later!" }
    }
}