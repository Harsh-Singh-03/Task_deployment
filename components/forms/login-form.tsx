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
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function LoginForm() {
    const [isProcessing, setIsProcessing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsProcessing(true)
        const res = await signIn("Credentials", {
            redirect: false,
            email: values.email,
            password: values.password
        })
        if (res?.ok) {
            toast.success("Successfully login !!")
            router.replace('/')
        } else {
            toast.info(res?.error)
        }
        setIsProcessing(false)
    }

    return (
        <Card className="w-full max-w-md mx-auto z-10 dark:bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-2xl">Log In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="Enter Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isProcessing}>
                            {isProcessing ? <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" /> : "Log In"}
                        </Button>
                    </form>
                </Form>
                <div className="flex justify-end">
                    <Link href='/sign-up' className="underline text-muted-foreground text-sm">Create New Account</Link>
                </div>
            </CardContent>
        </Card>
    )
}
