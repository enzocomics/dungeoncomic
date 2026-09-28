export default async function ComicEditPage({
	params
}: {
	params: Promise<{ comic_id: string }>
}) {
	const { comic_id } = await params
	return <>
		Hi it's me ur edit page {comic_id}
	</>
}