
// DATA
import { getSettings } from "@/lib/directus/get-settings"
import { ComicLandingPageUI, HomepagePageUI } from "./_page-ui"

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