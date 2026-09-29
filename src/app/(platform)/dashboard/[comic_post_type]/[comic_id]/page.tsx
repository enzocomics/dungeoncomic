export default async function ComicEditPage({
	params
}: {
	params: Promise<{
		comic_post_type: string,
		comic_id: string
	}>
}) {
	const { comic_post_type, comic_id } = await params
	return <>
		Hi it's me ur edit single {comic_post_type} series	 page. id: {comic_id}
	</>
}