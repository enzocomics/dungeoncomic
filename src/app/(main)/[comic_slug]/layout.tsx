"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { getComic } from "@/lib/directus/get-comics"
// UI
import ComicLayoutUI from "./_layout-ui"

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
		return <ComicLayoutUI comic_slug={comic_slug}>
			{children}
		</ComicLayoutUI>
}

/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata({
	params
}: {
	params: Promise<{ comic_slug: string }>
}): Promise<Metadata> {
	// Get the comic slug parameter
	const { comic_slug } = await params
	// Get the comic collection from the CMS
	const comic = await getComic(comic_slug)
	return {
		title: {
			template: `%s ∙ ${comic.title}`,
			default: comic.title,
		},
		description: comic.description
	}
}