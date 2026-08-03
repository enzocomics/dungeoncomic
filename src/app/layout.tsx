/**----------------------------------- */
// TYPES
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { Metadata, Viewport } from "next"
// UI
import RootLayoutUI from "./_ui"
import { GetSettings } from "@/lib/directus/get-settings"

/**-----------------------------------
 * APP - ROOT LAYOUT
 */
export default async function RootLayout(props: LayoutProps<"/">) {

	return <RootLayoutUI>
		{props.children}
	</RootLayoutUI>
}

/** ------------------------------------------------ **
 * Global Viewport
 ** ------------------------------------------------ **/
// TODO: Hardcode
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 0.5,
	maximumScale: 6,
	interactiveWidget: "resizes-visual",
	colorScheme: "light dark",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#e8e8e3" },
		{ media: "(prefers-color-scheme: dark)", color: "#1d1d16" },
	],
}

/** ------------------------------------------------ **
 * Global Metadata
 * - Homepage/fallback meta tags
 * - Will be overwritten by individual page meta tags
 ** ------------------------------------------------ **/

// Fallback Metadata Vars
const fallbackTitle = "DungeonConstruction Co."
const fallbackDescription = "We Build Adventure"
const fallbackUrl = "https://dungeonconstruction.co"
const fallbackAuthorName = "EnzoComics"
const fallbackAuthorUrl = "https://enzocomics.ca"
const fallbackThumbnail = {
	url: "/img/og-image.webp",
	type: "image/webp",
	width: "1600",
	height: "630",
	alt: "Dungeon Construction Co."
}

export async function generateMetadata(): Promise<Metadata> {
	// METADATA VARS
	const settings = await GetSettings()
	const locale: string = "en-CA"
	const title = settings.project_title || fallbackTitle
	const description = settings.project_description || fallbackDescription
	const url = settings.project_url || fallbackUrl

	// AUTHORS w/ DEFAULTS
	const getAuthors = settings.project_authors
	const authors = getAuthors && getAuthors.length > 0 ? getAuthors.map((a) => {
		let name
		let url
		if (a) {
			name = a.name ?? a.username ?? undefined
			url = a.homepage_url ?? undefined
			return {
				name: name,
				url: url
			}
		} else {
			return null
		}
	}
	) : [{ name: fallbackAuthorName, url: fallbackAuthorUrl }]

	const thumbnail = fallbackThumbnail

	// Build the Metadata Object
	return {
		metadataBase: url,
		alternates: {
			canonical: "/",
			languages: {
				"en-CA": "/",
			},
		},
		title: {
			default: title,
			template: `%s — ${title}`
		},
		description: description,
		authors: authors as Author[],
		referrer: "origin-when-cross-origin",
		openGraph: {
			description: description,
			siteName: title,
			url: url,
			locale: locale,
			type: "website",
			images: [thumbnail]
		},
		appleWebApp: {
			title: title
		}
	}
}