import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomePage from "../_screen/home";

export default async function Home() {
  const session = await getServerSession()
  if (!session || !session.user || !session.user.email) redirect('/sign-in')

  return (
    <div className="p-4 md:p-8">
      <HomePage />
    </div>
  );
}
