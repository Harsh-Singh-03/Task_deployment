"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode } from "react"
import { PRIORITY } from "@/lib/generated/prisma"
import { TaskForm } from "../forms/task-form"

interface props {
    isEdit: boolean,
    col_id: string,
    initialData?: {
        id: string
        title: string,
        description?: string | null,
        priority: PRIORITY,
        dueDate?: Date | null,
    },
    children: ReactNode
}

export const TaskDialog = ({ initialData, isEdit, children, col_id }: props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Update" : "Create"} Task</DialogTitle>
                </DialogHeader>
                <TaskForm isEdit={isEdit} initialData={initialData} col_id={col_id} />
            </DialogContent>
        </Dialog>

    )
}