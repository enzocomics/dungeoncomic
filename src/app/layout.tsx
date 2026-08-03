/**----------------------------------- */
// TYPES
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { Metadata, Viewport } from "next"
// UI
import RootLayoutUI from "./_ui"
import { directusURL } from "@/data/env"
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
export async function generateMetadata(): Promise<Metadata> {

	// METADATA VARS - FALLBACKS
	const fallbackTitle = "DungeonConstruction Co."
	const fallbackDescription = "We Build Adventure"
	const fallbackUrl = "https://dungeonconstruction.co"
	const fallbackAuthorName = "EnzoComics"
	const fallbackAuthorUrl = "https://enzocomics.ca"

	// FALLBACK IMAGES
	const fallbackThumbnail = {
		url: "/img/og-image.webp",
		type: "image/webp",
		width: "1600",
		height: "630",
		alt: "Dungeon Construction Co."
	}
	const fallbackFavicon = { url: "/favicon.ico", sizes: "256x256", type: "image/x-icon" }
	const fallbackIcon = { url: "/icon.svg", type: "image/svg+xml" }
	const fallbackAppleIcon = { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }

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

	// IMAGES
	const thumbnail = settings.project_thumbnail ? {
		url: `${directusURL}/assets/${settings.project_thumbnail.filename_disk}`,
		type: settings.project_thumbnail.type,
		width: settings.project_thumbnail.width,
		height: settings.project_thumbnail.height,
	} : fallbackThumbnail
	const favicon = fallbackFavicon
	const icon = fallbackIcon
	const appleIcon = fallbackAppleIcon

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
		icons: {
			icon: [
				favicon,
				icon
			],
			apple: [
				appleIcon
			]
		},
		appleWebApp: {
			title: title
		}
	}
}