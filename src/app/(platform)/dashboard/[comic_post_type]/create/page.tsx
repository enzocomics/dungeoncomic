export default async function CreateComicPage({
	params
}: {
	params: Promise<{
		comic_post_type: string,
		comic_id: string
	}>
}) {

	const { comic_post_type, comic_id } = await params
	return <>
		Hi it's me ur create new {comic_post_type} page
	</>
}