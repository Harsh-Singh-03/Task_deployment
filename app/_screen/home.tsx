"use client"

import { getColumnsTasks, reorderColumn } from "@/actions/column.action"
import { ColumnCard } from "@/components/cards/column-card"
import { ColumnDialog } from "@/components/dialog/column-dialog"
import { Button } from "@/components/ui/button"
import { Column, PRIORITY, Task } from "@/lib/generated/prisma"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Separator } from "@/components/ui/separator"
import { TaskSkeletonCard } from "@/components/globals/loading"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { reorderTask } from "@/actions/task.action"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

type columnType = Column & {
    tasks: Task[]
}

type filterType = {
    priority: null | PRIORITY
}

const HomePage = () => {
    const [PageContent, setPageContent] = useState<columnType[]>([])
    const [isDragDisabled, setIsDragDisabled] = useState(false)
    const [filter, setFilter] = useState<filterType>({
        priority: null
    })

    const { data: serverResponse, isPending, error } = useQuery({
        queryKey: ["PAGE_CONTENT", filter.priority],
        queryFn: () => getColumnsTasks(filter.priority),
        enabled: true,
    })

    useEffect(() => {
        console.log(serverResponse)
        console.log(error)
    }, [serverResponse, error])

    useEffect(() => {
        if (serverResponse?.data) {
            setPageContent(serverResponse.data)
        }
    }, [serverResponse])

    function reorder<T>(items: T[], startIndex: number, endIndex: number) {
        const result = Array.from(items);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onDragEnd = async (result: any) => {
        const { destination, source, type } = result;
        console.log(destination, source, type)
        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (type === "col") {
            const items = reorder(
                PageContent,
                source.index,
                destination.index,
            ).map((item, index) => ({ ...item, order: index + 1 }));

            setPageContent(items);
            const obj = items?.map((it) => {
                return { id: it.id, order: it.order }
            })
            setIsDragDisabled(true)
            const data = await reorderColumn({ columns: obj })
            setIsDragDisabled(false)
            if (data.success) toast.success(data.message)
            if (!data.success) toast.info(data.message)
        }

        if (type === 'task') {
            let newPageContent = [...PageContent];
            const sourceList = newPageContent.find(list => list.id === source.droppableId);
            const destList = newPageContent.find(list => list.id === destination.droppableId);
            if (!sourceList || !destList) return
            if (!sourceList.tasks) sourceList.tasks = [];
            if (!destList.tasks) destList.tasks = [];

            if (source.droppableId === destination.droppableId) {
                const reorderedCards = reorder(
                    sourceList.tasks,
                    source.index,
                    destination.index,
                );
                reorderedCards.forEach((task, idx) => {
                    task.order = idx + 1;
                });
                sourceList.tasks = reorderedCards;
                setPageContent(newPageContent);

                setIsDragDisabled(true)
                const data = await reorderTask(reorderedCards)
                setIsDragDisabled(false)
                if (data.success) toast.success(data.message)
                if (!data.success) toast.info(data.message)

            } else {
                const [movedCard] = sourceList.tasks.splice(source.index, 1);
                movedCard.columnId = destination.droppableId;
                destList.tasks.splice(destination.index, 0, movedCard);

                sourceList.tasks.forEach((task, idx) => {
                    task.order = idx + 1;
                });

                destList.tasks.forEach((task, idx) => {
                    task.order = idx + 1;
                });

                setPageContent(newPageContent);
                setIsDragDisabled(true)
                const data = await reorderTask(destList.tasks)
                setIsDragDisabled(false)
                if (data.success) toast.success(data.message)
                if (!data.success) toast.info(data.message)
            }

        }
    }


    return (
        <div className="">
            <div className="flex justify-between items-center">
                <div className="flex-1 flex items-center gap-4">
                    <Select value={filter?.priority || ""} onValueChange={(val: PRIORITY) => setFilter({ ...filter, priority: val })}>
                        <SelectTrigger className="w-[180px]">
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
                </div>
                <ColumnDialog isEdit={false}>
                    <Button size="sm">
                        Add Column
                        <Plus />
                    </Button>
                </ColumnDialog>
            </div>

            <Separator className="bg-neutral-300 dark:bg-secondary my-4 md:my-8" />

            {isPending && (
                <div className="w-full flex gap-8 md:gap-16">
                    <TaskSkeletonCard length={3} />
                    <TaskSkeletonCard length={2} />
                    <TaskSkeletonCard length={1} />
                </div>
            )}

            {!isPending && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="cols" type="col" direction="horizontal">
                        {(provided) => (
                            <div className={cn(
                                "w-full flex gap-8 md:gap-16",
                                isDragDisabled && "opacity-70"
                            )}
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                            >
                                {PageContent.map((col, index) => {
                                    return (
                                        <Draggable draggableId={col.id} index={index} key={col.id} isDragDisabled={isDragDisabled} >
                                            {(provided) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                                    {...provided.draggableProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <div {...provided.dragHandleProps}>
                                                        <ColumnCard col={col} key={col.id} isDragDisable={isDragDisabled} />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                            </div>
                        )}
                    </Droppable>
                </ DragDropContext>
            )}

        </div>
    )
}

export default HomePage
