"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ColumnForm } from "../forms/column-form"
import { ReactNode } from "react"

interface props {
    isEdit: boolean,
    initialData?: {
        id: string
        title: string
    },
    children: ReactNode
}

export const ColumnDialog = ({ initialData, isEdit, children }: props) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Update" : "Create"} Column</DialogTitle>
                </DialogHeader>
                <ColumnForm isEdit={isEdit} initialData={initialData} />
            </DialogContent>
        </Dialog>

    )
}