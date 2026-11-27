import { verifySession } from "@/data/session"
import EditComicTypeUI from "@/ui/dashboard/pages/comic-type-edit"
import { notFound } from "next/navigation"
import { connection } from "next/server"

export const instant = false

export default async function CreateComicPage() {
	await connection()

	const session = await verifySession()
	const userCanUpdateComics = session?.permissions?.comics?.update?.access === "full"

	if (userCanUpdateComics)
		return <EditComicTypeUI action="create" />
	else
		notFound()

}