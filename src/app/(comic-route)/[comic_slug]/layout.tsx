"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { notFound } from "next/navigation"
// DATA
import { getComic } from "@/lib/directus/get-comics"
// UI
import ComicLayoutUI from "./_layout-ui"
import { getSettings } from "@/lib/directus/get-settings"

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
	// METADATA VARS
	const { comic_slug } = await params
	const comic = await getComic(comic_slug)
	const settings = await getSettings()
	const url = `${settings.project_url}/${comic_slug}`

	// AUTHORS w/ DEFAULTS
	const authors = comic.authors && comic.authors.map((a) => {
		let name
		let url
		if (a) {
			name = a.name ?? a.username ?? a.email
			url = a.homepage_url ?? undefined
			return {
				name: name,
				url: url
			}
		} else {
			return null
		}
	})
	const authorsStr = authors!.map(a => a!["name"]).join(", ")
	// IMAGE & ICONS + FALLBACKS
	// VARS
	const projectName = settings.project_name || "Dungeon Construction Co."
	const title = comic.title
	const description = comic.description || `An adventure series by ${authorsStr}`

	// Build the Metadata Object
	return {
		title: {
			template: `%s ∙ title`,
			default: title,
		},
		description: description,
		authors: authors as Author[],
		openGraph: {
			description: description,
			siteName: projectName,
			url: url,
			locale: "",
			type: "website",
			images: []
		},
		twitter: {
			card: "summary_large_image",
			title: title,
			description: description,
			creator: authorsStr,
			images: []
		},
		icons: {
			icon: []
		}
	}
}