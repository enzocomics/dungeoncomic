import { getSettings } from "@/lib/directus/get-settings"
import { PlatformLayoutWrapper } from "../_ui/site-layout"
import PlatformRootLayout from "./_ui/layout-platform"
import RootParallelHeader from "./@header/page"
import { getComic } from "@/lib/directus/get-comics"
import { HomepagePageUI } from "./_ui/page/home"
import { ComicLandingPage } from "./_ui/layout-comic"
import ClientLandingPageHeader from "./_ui/@header/effects"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"

export default async function RootPage({
	header
}: {
	header: React.ReactNode
}) {
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
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
		// - Root: Comic Root Layout (AuthModal, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, SiteLayoutMain, SiteFooter)
		// - Level 1: None
		// - Level 2: 404
		// - level 3: 404

		// Pages:
		// - Root: Comic Landing Page
		// - Level 1: Comic Single Page
		// - Level 2: 404
		// - level 3: 404

		case "single/single":
			const comic = await getComic({ slug: frontpageComic?.slug })
			// Display the comic landing page at the root
			if (comic)
				return <ComicLandingPage comic={comic} />
			// Display homepage if no comics exist
			else
				return <HomepagePageUI />


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
		// - Level 1: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, SiteLayoutMain, SiteFooter)
		// - Level 2: None
		// - level 3: 404

		// Pages:
		// - Root: Platform Homepage
		// - Level 1: Comic Landing Page
		// - Level 2: Comic Single Page
		// - level 3: 404

		case "single/multiple":
		case "multiple/multiple":
			const homePageContent = await marked.parse(sanitize(String(settings.homepage_content || "")))
			return <>
				<PlatformRootLayout header={<ClientLandingPageHeader settings={settings} />}>
					<HomepagePageUI content={homePageContent} />
				</PlatformRootLayout>
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
		// - Level 2: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, SiteLayoutMain, SiteFooter)
		// - level 3: None

		// Pages:
		// - Root: Platform Homepage
		// - Level 1: 
		// - Level 2: Comic Landing Page
		// - level 3: Comic Single Page

		// case "multiple/multiple":
		// 	return <>
		// 	</>
	}
}