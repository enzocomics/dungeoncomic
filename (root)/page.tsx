import { getSettings } from "@/lib/directus/get-settings"
import PlatformRootLayout from "../../ui/platform/layout"
import { getComic } from "@/lib/directus/get-comics"
import { HomepagePageUI } from "../../ui/platform/pages/home"
import { ComicLandingPage } from "../../ui/comic/layout"
import ClientLandingPageHeader from "../../ui/comic/components/@header/effects"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import { Metadata } from "next"
import { comicMetadata } from "@/ui/comic/metadata"

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
		// - Level 1: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, PlatformMain, SiteFooter)
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
		// - Level 2: Comic Root Layout (Auth, ComicContext, ComicLayoutUI, SiteNav, ComicPageHeader, PlatformMain, SiteFooter)
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


/**-----------------------------------
 * Generate Homepage Metadata
 * ---
 **/
export async function generateMetadata(): Promise<Metadata | undefined> {
	// FETCH SETTINGS
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	const comic = await getComic({ slug: settings.frontpage_comic?.slug })

	switch (routingMode) {
		case "single/single":
			// On a single creator + comic site, display the metadata for the frontpage comic 
			return comic ? await comicMetadata(comic.slug) : {}
		case "single/multiple":
		case "multiple/multiple":
			// Fallback to the platform metadata when multiple comics are present 
			return {}
	}
}