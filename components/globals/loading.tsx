import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TaskSkeletonCard({ length }: { length: number }) {
    return (
        <div className="">
            <div className="pb-4 flex items-center justify-between">
                <Skeleton className="w-[120px] h-6" />
                <Skeleton className="w-[60px] h-6" />
            </div>
            <div className="space-y-4">
                {Array.from({ length }).map((_) => (
                    <Skeleton className="w-[284px] h-[200px]" />
                ))}
            </div>
        </div>
    )
}
