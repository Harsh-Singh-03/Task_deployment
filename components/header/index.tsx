"use client"

import { signOut, useSession } from "next-auth/react"
import { ModeToggle } from "../globals/theme-toggle"
import { Button } from "../ui/button"
import { LogOut } from "lucide-react"


export const Header = () => {
    const session = useSession()

    const SignOut = async () => {
        await signOut()
    }

    return (
        <header className="p-4 md:py-4 md:px-8 bg-background dark:bg-secondary flex justify-between items-center gap-4">
            <h2 className="font-bold text-2xl">TASK</h2>
            <div className="flex items-center justify-center gap-6">
                {session?.data?.user && (
                    <span className="text-base hidden md:block">Welcome, {session?.data?.user?.name}</span>
                )}
                <ModeToggle />
                {session?.status === "authenticated" && (
                    <Button variant="destructive" size={"sm"} onClick={() => SignOut()}>
                        <LogOut size={14} />
                    </Button>
                )}
            </div>
        </header>
    )
} 