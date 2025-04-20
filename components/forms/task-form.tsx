"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { DialogClose } from "../ui/dialog"
import { useRef } from "react"
import { PRIORITY } from "@/lib/generated/prisma"
import { Textarea } from "../ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { create_task, update_task } from "@/actions/task.action"

const formSchema = z.object({
    title: z.string().min(3, {
        message: "Task name should be 3 characters long",
    }),
    description: z.string().optional(),
    columnId: z.string(),
    priority: z.nativeEnum(PRIORITY, {
        required_error: "Priority is required",
        invalid_type_error: "Invalid priority value",
    }),
    dueDate: z.date().optional()
})

interface props {
    isEdit: boolean,
    col_id: string,
    initialData?: {
        id: string
        title: string,
        description?: string | null,
        priority: PRIORITY,
        dueDate?: Date | null,
    }
}

export function TaskForm({ isEdit, initialData, col_id }: props) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title || "",
            columnId: col_id,
            description: initialData?.description || "",
            dueDate: initialData?.dueDate || new Date(),
            priority: initialData?.priority || PRIORITY.HIGH
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

    const { isPending, mutate: createTask } = useMutation({
        mutationFn: create_task,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const { isPending: isUpdating, mutate: updateTask } = useMutation({
        mutationFn: update_task,
        onSuccess: (data: any) => data.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });


    const onSubmit = (val: z.infer<typeof formSchema>) => isEdit && initialData?.id ? updateTask({ id: initialData.id, body: val }) : createTask(val);

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
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea rows={3} placeholder="Enter Description" {...field} disabled={isPending || isUpdating} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <FormControl>
                                <Select {...field} onValueChange={(val) => field.onChange(val)} disabled={isPending || isUpdating}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Select Priority</SelectLabel>
                                            <SelectItem value={PRIORITY.HIGH}>High</SelectItem>
                                            <SelectItem value={PRIORITY.MEDIUM}>Medium</SelectItem>
                                            <SelectItem value={PRIORITY.LOW}>Low</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            disabled={isPending || isUpdating}
                                        >
                                            {field.value ? format(field.value, "PPP") : <span>Select date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={isPending || isUpdating}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
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
