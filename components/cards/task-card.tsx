"use client"

import { Task } from "@/lib/generated/prisma"
import { Button } from "../ui/button"
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Separator } from "../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { TaskDialog } from "../dialog/task-dialog"
import { deleteTask } from "@/actions/task.action"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface props {
    task: Task
}

export const TaskCard = ({ task }: props) => {

    const queryClient = useQueryClient()

    const onSuccess = (data: any) => {
        toast.success(data?.message)
        queryClient.invalidateQueries({ queryKey: ["PAGE_CONTENT"] });
    }

    const { mutate: DeleteTask } = useMutation({
        mutationFn: deleteTask,
        onSuccess: (data: any) => data?.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const onDeleteTask = () => {
        const confirmed = window.confirm("Are you sure you want to delete this task?")
        if (confirmed) {
            DeleteTask(task.id)
        }
      }
      
    return (
        <div className="w-full px-4 py-2 pb-4 bg-white dark:bg-secondary rounded-md">
            <div className=" flex items-center justify-between">
                <Badge
                    className={cn(
                        "text-white",
                        task.priority === "HIGH" && "bg-pink-600 hover:bg-pink-600/80",
                        task.priority === "MEDIUM" && "bg-orange-600 hover:bg-orange-600/80",
                        task.priority === "LOW" && "bg-sky-600 hover:bg-sky-600/80",
                    )}
                >{task.priority}</Badge>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link" className="p-0"><MoreHorizontal /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[120px]">
                        <div className="">
                            <TaskDialog isEdit={true} col_id={task.columnId} initialData={{
                                id: task.id,
                                description: task.description,
                                title: task.title,
                                dueDate: task.dueDate,
                                priority: task.priority
                            }}>
                                <button className="justify-start flex gap-3 text-muted-foreground hover:text-primary items-center">
                                    <Edit size={16} />
                                    Edit
                                </button>
                            </TaskDialog>
                            <Separator className="my-2" />
                            <button className="justify-start flex gap-3 text-muted-foreground hover:text-primary items-center" onClick={onDeleteTask}>
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Separator className="my-4 dark:bg-neutral-700" />
            <div className="space-y-2">
                <h4>{task.title}</h4>
                <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
            {task.dueDate && (
                <div className="flex items-center gap-4 mt-4 text-sm">
                    <span>Due Date :</span> <Badge>{format(task.dueDate, "PPP")}</Badge>
                </div>
            )}
            <Separator className="my-4 dark:bg-neutral-700" />
            <div className="flex justify-end">
                <span className="text-muted-foreground text-sm">Last Updated: {format(task.updatedAt, "PPP")}</span>
            </div>
        </div>
    )

}