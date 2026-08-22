"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { getTranslations } from "next-intl/server"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"



/**-----------------------------------
 * METADATA - FALLBACK VARIABLES
 * ---
 */


// FALLBACK IMAGES
const fallbackThumbnail = {
	url: "/img/og-image.webp",
	type: "image/webp",
	width: "1600",
	height: "630",
	alt: "Dungeon Construction Co."
}

// METADATA VARS
const settings = await getSettings()
const fallbackProjectName = "Dungeon Construction Co."
const projectName = settings.project_name || fallbackProjectName

// PROJECT IMAGES & ICONS + FALLBACKS
const projectThumbnail = settings.project_thumbnail ? {
	url: `${directusURL}/assets/${settings.project_thumbnail.filename_disk}`,
	type: settings.project_thumbnail.type,
	width: settings.project_thumbnail.width,
	height: settings.project_thumbnail.height,
} : fallbackThumbnail

/**-----------------------------------
 * METADATA - COMIC PROJECT
 * ---
 */
export async function comicMetadata(
	comic_slug: string
) {
	const locale: string = "en-CA" // TODO: I18N
	// FETCH COMIC VARS
	const comic = await getComic(comic_slug)
	const url = `${settings.project_url}/${comic_slug}`

	// AUTHORS w/ DEFAULTS
	const authors = comic.authors && comic.authors.map((a) => {
		let name
		let url
		if (a) {
			// Start with the name. Fallback to username. Otherwise, don't show
			name = a.name ?? a.username ?? undefined
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

	// THUMBNAIL
	const thumbnail = comic.thumbnail ? {
		url: `${directusURL}/assets/${comic.thumbnail.filename_disk}`,
		type: comic.thumbnail.type,
		width: comic.thumbnail.width,
		height: comic.thumbnail.height,
	} : projectThumbnail || fallbackThumbnail

	// VARS
	const title = comic.title
	const description = comic.description || `A comic adventure series${authorsStr ? " by " + authorsStr : ""}`

	// METADATA OBJECT
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
			locale: locale,
			type: "website",
			images: [thumbnail]
		},
		twitter: {
			card: "summary_large_image",
			title: title,
			description: description,
			creator: authorsStr,
		},
	} as Metadata
}

/**-----------------------------------
 * METADATA - COMIC SINGLE PAGE
 * ---
 */
export async function comicPageMetadata(
	comic_slug: string,
	pagenum: number
) {
	const locale: string = "en-CA" // TODO: I18N
	// FETCH COMIC VARS
	const comic = await getComic(comic_slug)
	const comicPage = await getComicPage(comic_slug, pagenum)
	const url = `${settings.project_url}/${comic_slug}/${pagenum}`


	// AUTHORS w/ DEFAULTS
	const authors = comic.authors && comic.authors.map((a) => {
		let name
		let url
		if (a) {
			// Start with the name. Fallback to username. Otherwise, don't show
			name = a.name ?? a.username ?? undefined
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


	// VARS
	const comicTitle = comic.title
	const pageTitle = comicPage.title || `Page ${pagenum}`
	const description = comicPage.description || `Page ${pagenum} of ${comicTitle}, a comic adventure series${authorsStr ? " by " + authorsStr : ""}`

	// THUMBNAIL
	// - Shows the image from the first panel, if it exists
	// - Falls back to the comic PAGE thumbnail, if it has been defined
	// - Otherwise, fall back to the project thumbnail, and finally, DCC's thumbnail
	const comicThumbnail = comic.thumbnail ? {
		url: `${directusURL}/assets/${comic.thumbnail.filename_disk}`,
		type: comic.thumbnail.type,
		width: comic.thumbnail.width,
		height: comic.thumbnail.height,
	} : projectThumbnail || fallbackThumbnail

	const pageThumbnail = comicPage.thumbnail ? {
		url: `${directusURL}/assets/${comicPage.thumbnail.filename_disk}`,
		type: comicPage.thumbnail.type,
		width: comicPage.thumbnail.width,
		height: comicPage.thumbnail.height,
	} : comicThumbnail

	const thumbnail = comicPage.comic_panels && comicPage.comic_panels[0].panel_image ? {
		url: `${directusURL}/assets/${comicPage.comic_panels[0].panel_image.filename_disk}`,
		type: comicPage.comic_panels[0].panel_image.type,
		width: comicPage.comic_panels[0].panel_image.width,
		height: comicPage.comic_panels[0].panel_image.height,
	} : pageThumbnail

	// METADATA OBJECT
	return {
		title: {
			template: `%s ∙ ${pageTitle}`,
			default: `${pageTitle} | ${comicTitle}`,
		},
		description: description,
		authors: authors as Author[],
		openGraph: {
			description: description,
			siteName: projectName,
			url: url,
			locale: locale,
			type: "website",
			images: [thumbnail]
		},
		twitter: {
			card: "summary_large_image",
			title: pageTitle,
			description: description,
			creator: authorsStr,
		},
	} as Metadata
}


/**-----------------------------------
 * METADATA - 404
 * ---
 */

export async function notFoundMetadata() {
	const t = await getTranslations("404Page")
	return {
		title: t("title")
	}
}