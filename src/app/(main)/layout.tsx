"use server"
/**----------------------------------- */
// DATA
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { FrontpageLayoutUI, FrontpageWithComicLayoutUI } from "./_layout-ui"
import ComicLayoutUI from "./(comic-route)/[comic_slug]/_layout-ui"
import { notFound } from "next/navigation"

/**-----------------------------------
 * MAIN - ROOT LAYOUT
 */
export default async function MainRootLayout(props: LayoutProps<"/">) {
	// Conditionally Render UI based on the frontpage_comic setting
	const settings = await getSettings()

	// Render the chosen comic on the front page
	if (settings.frontpage_comic) {
		const comic_slug = settings.frontpage_comic.slug
		// Check if the comic exists in the database in the db
		const comic = await getComic(comic_slug)
		// Return the UI only if a comic exists
		if (!comic) notFound()
		return <FrontpageLayoutUI>
			<ComicLayoutUI comic_slug={comic_slug}>
				{props.children}
			</ComicLayoutUI>
		</FrontpageLayoutUI >

	} else {
		// Render the default homepage layout
		return <>
			<FrontpageLayoutUI>
				{props.children}
			</FrontpageLayoutUI >
		</>
	}
}