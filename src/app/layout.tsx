/**----------------------------------- */
// LIBRARIES
import { Metadata, Viewport } from "next"
// UI
import RootLayoutUI from "./_ui"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
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
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#eaeaea' },
		{ media: '(prefers-color-scheme: dark)', color: '#222222' },
	],
	interactiveWidget: 'resizes-content',
	// colorScheme: "dark light",
}

/** ------------------------------------------------ **
 * Global Metadata
 * - Homepage/fallback meta tags
 * - Will be overwritten by individual page meta tags
 ** ------------------------------------------------ **/
// TODO: Hardcode
const globalSiteThumb = {
	url: "/apple-touch-icon.png",
	type: "image/png",
	width: "200",
	height: "200",
	alt: "Dungeon Construction Co."
}

export async function generateMetadata(): Promise<Metadata> {
	const locale: string = "en-CA"
	const title = "Dungeon Comic"
	const description = "We Build Adventure"
	const url = "https://dungeoncomic.com"

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
			template: `%s - ${title}`
		},
		description: description,
		authors: [{ name: "EnzoComics", url: "https://enzocomics.ca" }],
		referrer: "origin-when-cross-origin",
		openGraph: {
			description: description,
			siteName: title,
			url: url,
			locale: locale,
			type: "website",
			images: [globalSiteThumb]
		},
		manifest: "/manifest.json",
		icons: {
			icon: [
				{ url: "/favicon.ico" },
				{ url: "/favicon-16x16.png", sizes: "16x16" },
				{ url: "/favicon-32x32.png", sizes: "32x32" },
			],
			apple: [
				{ url: "/apple-touch-icon.png", sizes: "180x180" }
			],
			other: [
				{ rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" }
			]
		},
		appleWebApp: {
			title: title
		}

	}
}