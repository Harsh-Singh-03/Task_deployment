"use client"

import { Column, Task } from "@/lib/generated/prisma"
import { Button } from "../ui/button"
import { Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { ColumnDialog } from "../dialog/column-dialog"
import { Separator } from "../ui/separator"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteColumn } from "@/actions/column.action"
import { toast } from "sonner"
import { TaskDialog } from "../dialog/task-dialog"
import { TaskCard } from "./task-card"
import { Draggable, Droppable } from '@hello-pangea/dnd'
type columnType = Column & {
    tasks: Task[]
}

interface props {
    col: columnType,
    isDragDisable: boolean
}

export const ColumnCard = ({ col, isDragDisable }: props) => {

    const queryClient = useQueryClient()

    const onSuccess = (data: any) => {
        toast.success(data?.message)
        queryClient.invalidateQueries({ queryKey: ["PAGE_CONTENT"] });
    }

    const { isPending: isDeleting, mutate: DeleteColumn } = useMutation({
        mutationFn: deleteColumn,
        onSuccess: (data: any) => data?.success ? onSuccess(data) : toast.warning(data.message),
        onError: (error) => toast.error(error?.message)
    });

    const onDeleteCol = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this task?")
        if (confirmed) {
            DeleteColumn(col.id)
        }
    }

    return (
        <div className="min-w-[284px]">
            <div className="pb-4 flex items-center justify-between">
                <h4 className="font-bold">{col.title}</h4>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="link" className="p-0"><MoreHorizontal /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[120px]">
                        <div className="">
                            <ColumnDialog isEdit={true} initialData={{ title: col.title, id: col.id }}>
                                <button className="justify-start flex gap-3 text-muted-foreground hover:text-primary items-center">
                                    <Edit size={16} />
                                    Edit
                                </button>
                            </ColumnDialog>
                            <Separator className="my-2" />
                            <button className="justify-start flex gap-3 text-muted-foreground hover:text-primary items-center" onClick={onDeleteCol}>
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <Droppable droppableId={col.id} type="task">
                {(provided) => (
                    <div className="space-y-4"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {col?.tasks?.length > 0 ? col.tasks?.map((task, index) => (
                            <Draggable draggableId={task.id} index={index} key={task.id} isDragDisabled={isDragDisable} >
                                {(provided) => (
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef} 
                                    >
                                        <TaskCard key={task.id} task={task} />
                                    </div>
                                )}

                            </Draggable>
                        )) : (
                            <Draggable draggableId={"1"} index={1} key={1}>
                                {(provided) => (

                                    <div className='h-2.5'
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}>
                                    </div>

                                )}
                            </Draggable>
                        )}
                    </div>
                )}
            </Droppable>
            <Separator className="mt-4 mb-2" />
            <TaskDialog isEdit={false} col_id={col.id}>
                <Button variant="link" className="text-muted-foreground hover:text-primary transition-all px-0">
                    <Plus />
                    Add Task
                </Button>
            </TaskDialog>
        </div>
    )

}