import { verifySession } from "@/data/session"
import EditComicTypeUI from "@/ui/comic/pages/create-edit"
import { notFound } from "next/navigation"

export const instant = false

export default async function ComicEditPage({
	params
}: {
	params: Promise<{
		comic_post_type: string,
		comic_id: string
	}>
}) {
	const { comic_post_type, comic_id } = await params

	const session = await verifySession()
	const userCanUpdateComics = session?.permissions?.comics?.update?.access === "full"

	if (userCanUpdateComics)
		return <EditComicTypeUI
			action="update"
			comicID={parseInt(comic_id)}
		/>
	else
		notFound()


}