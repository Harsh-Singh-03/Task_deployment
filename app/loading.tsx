import { Loader2 } from "lucide-react"


const Loading = () => {
  return (
    <div className="flex justify-center my-8 items-center">
        <Loader2 className="animate-spin" size={48} />
    </div>
  )
}

export default Loading
