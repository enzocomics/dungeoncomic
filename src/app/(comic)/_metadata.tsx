"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// DATA
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"

export async function comicMetadata(
	comic_slug: string
) {
	// FETCH COMIC VARS
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