export default async function ComicEditPage({
	params
}: {
	params: Promise<{ comic_id: string }>
}) {
	const { comic_id } = await params
	return <>
		Hi it's me ur edit single comic series	 page. id: {comic_id}
	</>
}