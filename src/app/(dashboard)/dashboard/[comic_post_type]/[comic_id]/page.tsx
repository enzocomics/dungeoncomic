import EditComicTypeUI from "@/ui/dashboard/pages/comic-edit"

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
	return <EditComicTypeUI
		action="update"
		comicID={parseInt(comic_id)}
	/>
	// 	Hi it's me ur edit single {comic_post_type} series	 page. id: {comic_id}
	// </>
}