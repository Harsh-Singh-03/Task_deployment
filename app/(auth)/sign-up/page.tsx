import { RegisterForm } from "@/components/forms/register-form"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

const Page = async () => {
    const session = await getServerSession()
    if (session && session.user) {
        return redirect('/')
    }

    return (
        <div className="min-h-screen w-full grid place-items-center relative px-4">
            <RegisterForm />
        </div>
    )
}

export default Page
