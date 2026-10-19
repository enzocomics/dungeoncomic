/**----------------------------------- */
import "@/styles/globals.css"
import { fonts } from "@/styles/fonts"
// STYLES
import { colorVariants } from "@/styles/colors"
// TYPES
import { Author } from "next/dist/lib/metadata/types/metadata-types"
// LIBRARIES
import { ThemeProvider } from "@teispace/next-themes"
import { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
// DATA
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
// FUNCTIONS
import clsx from "clsx"
// UI
import GlobalContextProvider from "@/ui/platform/context"
import ClientPlatformEffects from "@/ui/platform/effects"
import { Suspense } from "react"
import { getComic } from "@/lib/directus/get-comics"

/**-----------------------------------
 * APP - ROOT LAYOUT
 */
export default async function RootLayout(props: LayoutProps<"/">) {
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	const isSingleSingleMode = routingMode === "single-single"
	const frontpageComic = isSingleSingleMode ? await getComic({ slug: settings.frontpage_comic?.slug }) : undefined
	const fontHeaders = isSingleSingleMode ? frontpageComic?.font_headers : settings.font_headers
	const fontLabels = isSingleSingleMode ? frontpageComic?.font_labels : settings.font_labels
	const fontCopy = isSingleSingleMode ? frontpageComic?.copy_font : settings.font_copy
	const fontMono = isSingleSingleMode ? frontpageComic?.font_mono : settings.font_mono
	const accentColor = isSingleSingleMode ? (frontpageComic?.accent_color && frontpageComic?.accent_color || settings.color_accent) : settings.color_accent

	return <html lang="en" suppressHydrationWarning
		className={clsx(
			"h-full",
			Object.values(fonts).map((f) => f.font.variable),
			// Default Colours
			"text-base-content",
			// Next.js has an issue when using a <Link> component combined with a sticky header that requires this as a fix
			// - https://github.com/vercel/next.js/discussions/64435#discussioncomment-15734999
			"scroll-pt-[100svh]",
			"has-focus-within:scroll-pt-0",
			//
		)}
	>
		<body
			className={clsx(
				"min-w-xs",
				"h-full",
				"font-platform-copy",
				"relative",
				"bg-fixed",
				"bg-neutral-100",
				"dark:bg-neutral-800",
			)}
			style={{
				// Fonts
				"--font-platform-headers": `var(--font-${fontHeaders})`,
				"--font-platform-labels": `var(--font-${fontLabels})`,
				"--font-platform-copy": `var(--font-${fontCopy})`,
				"--font-platform-mono": `var(--font-${fontMono})`,
				// Colors
				"--color-platform-accent-50": `var(${colorVariants[accentColor]["50"]})`,
				"--color-platform-accent-100": `var(${colorVariants[accentColor]["100"]})`,
				"--color-platform-accent-200": `var(${colorVariants[accentColor]["200"]})`,
				"--color-platform-accent-300": `var(${colorVariants[accentColor]["300"]})`,
				"--color-platform-accent-400": `var(${colorVariants[accentColor]["400"]})`,
				"--color-platform-accent-500": `var(${colorVariants[accentColor]["500"]})`,
				"--color-platform-accent-600": `var(${colorVariants[accentColor]["600"]})`,
				"--color-platform-accent-700": `var(${colorVariants[accentColor]["700"]})`,
				"--color-platform-accent-800": `var(${colorVariants[accentColor]["800"]})`,
				"--color-platform-accent-900": `var(${colorVariants[accentColor]["900"]})`,
				"--color-platform-accent-950": `var(${colorVariants[accentColor]["950"]})`,
			} as React.CSSProperties}
		// style={{
		// 	// https://heropatterns.com/
		// 	backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.15'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
		// }}
		>
			<GlobalContextProvider>
				<ThemeProvider
					defaultTheme="system"
					attribute={['class', 'data-theme']}
					themes={["system", "light", "dark"]}
					disableTransitionOnChange={true}
				>
					<NextIntlClientProvider>
						<Suspense>
							<ClientPlatformEffects />
						</Suspense>
						{props.children}
					</NextIntlClientProvider>
				</ThemeProvider>
			</GlobalContextProvider>
		</body>
	</html>
}

/** ------------------------------------------------ **
 * Global Viewport
 ** ------------------------------------------------ **/
export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 0.5,
	maximumScale: 6,
	// interactiveWidget: "resizes-visual",
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
	const locale: string = "en-CA" // TODO: I18N
	const projectName = settings.project_name || fallbackProjectName
	const description = settings.project_description || fallbackDescription
	const url = settings.project_url || fallbackUrl

	// AUTHORS w/ DEFAULTS
	const getAuthors = settings.project_authors
	const authors = getAuthors && getAuthors.length > 0 ? getAuthors.map((a) => {
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