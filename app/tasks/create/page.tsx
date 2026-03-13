import { redirect } from "next/navigation"

export default function CreateTaskRedirectPage() {
  redirect("/task/create")
}
