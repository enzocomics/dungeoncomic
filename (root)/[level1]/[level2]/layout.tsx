import { getSettings } from "@/lib/directus/get-settings"
import { PropsWithChildren } from "react"
import { ComicRootLayout } from "../../../../ui/comic/layout"
import { notFound } from "next/navigation"

export default async function Level2Layout({
	header,
	params,
	...props
}: {
	header: React.ReactNode
	params: Promise<{ level1: string, level2: string }>
} & PropsWithChildren) {
	const { level1, level2 } = await params
	const settings = await getSettings()
	const routingMode = settings.routing_mode

	switch (routingMode) {
		/* ----------------------------------- */
		// Single Creator, Single Comic
		// - Comic lives at root: `dungeoncomic.com`
		// - Pages live at first-level route: `dungeoncomic.com/1`, `dungeoncomic.com/settings`

		// Structure:
		// - `root`: comic homepage
		// - `root/[level1]`: comic single page / comic content page
		// - `root/[level1]/[level2]`: 404
		// - `root/[level1]/[level2]/[level3]`: 404

		// Layouts:
		// - Root: Comic Root Layout (AuthModal, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, PlatformMain, SiteFooter)
		// - Level 1: None
		// - Level 2: 404
		// - level 3: 404

		// Pages:
		// - Root: Comic Landing Page
		// - Level 1: Comic Single Page
		// - Level 2: 404
		// - level 3: 404

		case "single/single":
			return <>
				{props.children}
			</>

		/* ----------------------------------- */
		// Single Creator, Multiple Comics
		// - Comics live at first-level route: `dungeoncomic.com/comicname`
		// - Pages live at second-level nested route: `dungeoncomic.com/comicname/1`, `dungeoncomic.com/comicname/settings`

		// Structure:
		// - `root`: platform homepage
		// - `root/[level1]`: comic homepage / platform page
		// - `root/[level1]/[level2]`: comic single page / comic content page
		// - `root/[level1]/[level2]/[level3]`: 404

		// Layouts:
		// - Root: Platform Root Layout
		// - Level 1: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, PlatformMain, SiteFooter)
		// - Level 2: None
		// - level 3: 404

		// Pages:
		// - Root: Platform Homepage
		// - Level 1: Comic Landing Page
		// - Level 2: Comic Single Page
		// - level 3: 404

		case "single/multiple":
			return <>
				{props.children}
			</>

		/* ----------------------------------- */
		// Multiple Creators, Multiple Comics
		// - Comics live in a nested route with type prefix: `dungeoncomic.com/d/comicname`
		// - Pages live in a nested route with type & comic prefix: 
		//   `dungeoncomic.com/d/comicname/1`, `dungeoncomic.com/d/comicname/settings`
		// - Users live in a nested route with type prefix: `dungeoncomic.com/u/username`

		// Structure:
		// - `root`: platform homepage
		// - `root/[level1]`: comic type prefix / platform page
		// - `root/[level1]/[level2]`: comic homepage
		// - `root/[level1]/[level2]/[level3]`: comic single page / comic content page

		// Layouts:
		// - Root: Platform Root Layout
		// - Level 1: 
		// - Level 2: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, PlatformMain, SiteFooter)
		// - level 3: None

		// Pages:
		// - Root: Platform Homepage
		// - Level 1: 
		// - Level 2: Comic Landing Page
		// - level 3: Comic Single Page

		case "multiple/multiple":
			if (settings.post_type_name_slug == level1)
				return <>
					<ComicRootLayout header={header} slug={level2}>
						{props.children}
					</ComicRootLayout>
				</>
			else notFound()
	}
}