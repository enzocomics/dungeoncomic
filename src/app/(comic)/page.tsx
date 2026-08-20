"use server"
/**----------------------------------- */
// TYPES
import { Metadata } from "next"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicLandingPageUI, HomepagePageUI } from "./_page-ui"
import { comicMetadata } from "./_metadata"

/**-----------------------------------
 * HOMEPAGE PAGE
 * ---
 * **Layout Mode 1 (Default)**
 * - Only available when there is only one comic
 * - Display comic at the root 
 * - Subpages would be accessible at i.e. `dungeoncomic.com/1`
 * 
 * **Layout Mode 2**
 * - All comics live in their subfolder `dungeoncomic.com/comicslug`
 * - Subpages would be accessible at i.e. `dungeoncomic.com/comicslug/1`
 * 
 */
export default async function Homepage() {
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic
	// LAYOUT MODE 1: RETURN COMIC LANDING PAGE UI
	if (frontpage_comic)
		return <ComicLandingPageUI />
	// LAYOUT MODE 2: RETURN HOMEPAGE PAGE
	else
		return <HomepagePageUI />

}

/**-----------------------------------
 * Generate Metadata
 * ---
 **/
export async function generateMetadata(): Promise<Metadata | undefined> {
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic
	/**----------------------------------- */
	// LAYOUT MODE 1: COMIC LANDING PAGE
	// - Load the comic metadata
	if (frontpage_comic)
		return await comicMetadata(frontpage_comic.slug)
	/**----------------------------------- */
	// LAYOUT MODE 2: HOMEPAGE
	// - Don't return anything. All the metadata is already defined in the root layout
	else if (!frontpage_comic)
		return {}
}