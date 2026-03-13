import { redirect } from "next/navigation"

type TasksIdRedirectPageProps = {
  params: Promise<{ id: string }>
}

export default async function TasksIdRedirectPage({ params }: TasksIdRedirectPageProps) {
  const { id } = await params
  redirect(`/task/${id}`)
}
