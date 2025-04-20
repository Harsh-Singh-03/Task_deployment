"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { create_column, updateColumn } from "@/actions/column.action"
import { DialogClose } from "../ui/dialog"
import { useRef } from "react"

const formSchema = z.object({
    title: z.string().min(3, {
        message: "Column name should be 3 characters long",
    })
})

interface props {
    isEdit: boolean,
    initialData?: {
        id: string
        title: string
    }
}

export function ColumnForm({ isEdit, initialData }: props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || ""
        },
    })

    const queryClient = useQueryClient();

    const btnRef = useRef<HTMLButtonElement>(null)

    const text = isEdit ? "Update" : "Create"

    const onSuccess = (data: any) => {
        toast.success(data?.message)
        btnRef?.current?.click()
        queryClient.invalidateQueries({ queryKey: ["PAGE_CONTENT"] });
    }

    const { isPending, mutate: createColumn } = useMutation({
        mutationFn: create_column,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const { isPending: isUpdating, mutate: update_column } = useMutation({
        mutationFn: updateColumn,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });


    const onSubmit = (val: z.infer<typeof formSchema>) => isEdit && initialData?.id ? update_column({ id: initialData.id, body: val }) : createColumn(val.title);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Enter Title" {...field} disabled={isPending || isUpdating} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isPending || isUpdating}>
                        {(isPending || isUpdating) ? <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" /> : text}
                    </Button>
                </div>
            </form>
            <DialogClose ref={btnRef} className="hidden">Close</DialogClose>
        </Form>
    )
}
