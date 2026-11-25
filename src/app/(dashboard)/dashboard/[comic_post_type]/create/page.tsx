import CreateComicPageUI from "@/ui/dashboard/pages/comic-create"
import { connection } from "next/server"

export const instant = false

export default async function CreateComicPage() {
	await connection()
	return <CreateComicPageUI />
}