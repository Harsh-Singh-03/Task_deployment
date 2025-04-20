"use server"

import { db } from "@/lib/db"
import { fetchUser } from "./user.action"
import { PRIORITY } from "@/lib/generated/prisma"

interface task_props {
    columnId: string, title: string, priority: PRIORITY, description?: string, dueDate?: Date
}
/** Create task */
export const create_task = async ({ columnId, title, priority, description, dueDate }: task_props) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }

        const last_column = await db.task.findFirst({
            where: { columnId },
            orderBy: { order: "desc" },
            select: { order: true },
        });
        const newOrder = last_column ? last_column.order + 1 : 1;

        await db.task.create({
            data: {
                title,
                order: newOrder,
                columnId,
                priority,
                description: description || "",
                dueDate
            }
        })
        return { success: true, message: `Task "${title}" created!` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

interface task_update_props {
    title: string, priority: PRIORITY, description?: string, dueDate?: Date
}
/** Update Task */
export const update_task = async ({ id, body }: { id: string, body: task_update_props }) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }

        const isExist = await db.task.findUnique({ where: { id } })
        if (!isExist) {
            return { success: false, message: "Task did not exist" }
        }

        await db.task.update({
            where: { id },
            data: body
        })

        return { success: true, message: `Task "${body.title}" updated` }

    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

/** Delete Column */
export const deleteTask = async (id: string) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }

        await db.task.delete({
            where: { id }
        })

        return { success: true, message: "Task Deleted Successfully" }

    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}

interface Obj {
    order: number;
    id: string;
    columnId: string;
}
/** Reorder task */
export const reorderTask = async (items: Obj[]) => {
    try {
        const res = await fetchUser()
        if (res.success === false || !res.user) return { success: false, message: 'Unauthorized session expired !!' }
        const transaction = items.map((task) =>
            db.task.update({
                where: {
                    id: task.id
                },
                data: {
                    order: task.order,
                    columnId: task.columnId,
                },
            }),
        );

        await db.$transaction(transaction);
        return { success: true, message: `Task "Reordered"` }
    } catch (error) {
        return { success: false, message: 'server error try again !' }
    }
}