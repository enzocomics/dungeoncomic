"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import HomepagePageUI from "./_page-ui"
import ComicLandingPageUI from "./(comic-route)/[comic_slug]/_page-ui"

/**----------------------------------- */
export default async function HomePage() {
	// Conditionally render UI based on the frontpage_comic setting
	const settings = await getSettings()
	// If a `frontpage_comic` has been set, render comic UI
	if (settings.frontpage_comic) {
		return <ComicLandingPageUI />
	} else {
		// Otherwise, render the regular homepage UI
		return <HomepagePageUI />
	}
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("HomePage")
	return {
		title: t("title"),
	}
}