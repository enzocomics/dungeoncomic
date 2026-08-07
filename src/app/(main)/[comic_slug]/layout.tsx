"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

/**-----------------------------------
 * COMIC ROUTE LAYOUT
 */
export default async function ComicLayout({
	params,
	children
}: {
	params: Promise<{ comic_slug: string }>
	children: React.ReactNode
}) {
	const { comic_slug } = await params
	return <>
		Comic Layout<br />
		get the `comic_slug` in layout: {comic_slug} <br />
		{children}
	</>
}