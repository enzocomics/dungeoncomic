"use server"
import { getComic } from "@/lib/directus/get-comics"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
import { notFound } from "next/navigation"

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
	// Get the comic slug parameter
	const { comic_slug } = await params
	// Check if the comic exists in the database in the db
	const comic = await getComic(comic_slug)

	// Return the UI only if a comic exists
	if (!comic) notFound()
	else
		return <>
			Comic Layout<br />
			get the `comic_slug` in layout: {comic_slug} <br />
			{children}
		</>
}