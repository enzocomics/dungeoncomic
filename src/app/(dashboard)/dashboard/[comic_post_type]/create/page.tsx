import EditComicTypeUI from "@/ui/dashboard/pages/comic-edit"
import { connection } from "next/server"

export const instant = false

export default async function CreateComicPage() {
	await connection()
	return <EditComicTypeUI action="create" />
}