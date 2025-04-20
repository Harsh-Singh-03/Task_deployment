"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios'
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
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be 3 character long"
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function RegisterForm() {
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
        try {
            setIsProcessing(true)
            const { data } = await axios.post('/api/auth/create-account', values)
            if (data?.success) {
                const res = await signIn("Credentials", {
                    redirect: false,
                    email: values.email,
                    password: values.password
                })
                if (res?.ok) {
                    toast.success("Login successfully")
                    router.replace('/')
                } else {
                    router.replace('/sign-in')
                }
            } else {
                toast.info(data?.message)
            }
        } catch (error) {
            toast.error("Server Error")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto z-10 dark:bg-secondary/50">
            <CardHeader>
                <CardTitle className="text-2xl">Create New Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Enter name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            {isProcessing ? <Loader2 className="text-muted-foreground w-4 h-4 animate-spin" /> : "Create New Account"}
                        </Button>
                    </form>
                </Form>
                <div className="flex justify-end">
                    <Link href='/sign-in' className="underline text-muted-foreground text-sm">Log In</Link>
                </div>
            </CardContent>
        </Card>
    )
}
