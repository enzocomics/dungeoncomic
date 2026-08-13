/**----------------------------------- */
// TYPES
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { Metadata, Viewport } from "next"
// UI
import RootLayoutUI from "./_ui"
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"

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
	const fallbackProjectName = "Dungeon Construction Co."
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
	const fallbackIcon = { url: "/icon.svg", type: "image/svg+xml" }
	const fallbackAppleIcon = { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }

	// METADATA VARS
	const settings = await getSettings()
	const locale: string = "en-CA"
	const projectName = settings.project_name || fallbackProjectName
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

	// IMAGES & ICONS + FALLBACKS
	const thumbnail = settings.project_thumbnail ? {
		url: `${directusURL}/assets/${settings.project_thumbnail.filename_disk}`,
		type: settings.project_thumbnail.type,
		width: settings.project_thumbnail.width,
		height: settings.project_thumbnail.height,
	} : fallbackThumbnail

	const icon = settings.project_svg_icon ? {
		url: `${directusURL}/assets/${settings.project_svg_icon.filename_disk}`,
		type: settings.project_svg_icon.type,
		width: settings.project_svg_icon.width,
		height: settings.project_svg_icon.height,
	} : fallbackIcon

	const appleIcon = settings.project_apple_icon ? {
		url: `${directusURL}/assets/${settings.project_apple_icon.filename_disk}`,
		type: settings.project_apple_icon.type,
		width: settings.project_apple_icon.width,
		height: settings.project_apple_icon.height,
	} : fallbackAppleIcon

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
			default: projectName,
			template: `%s ∙ ${projectName}`
		},
		description: description,
		authors: authors as Author[],
		referrer: "origin-when-cross-origin",
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
			title: projectName,
			description: description,
			creator: `${authors!.map(a => a!["name"]).join(", ")}`,
			images: [thumbnail.url]
		},
		icons: {
			icon: [
				icon,
			],
			apple: [
				appleIcon
			]
		},
		appleWebApp: {
			title: projectName
		}
	}
}