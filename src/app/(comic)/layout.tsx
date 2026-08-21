/**----------------------------------- */
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicLayoutUI, FrontpageLayoutUI } from "./_ui-layout"
import { getComic } from "@/lib/directus/get-comics"

/**-----------------------------------
 * HOMEPAGE LAYOUT
 * ---
 * - Conditionally render the comic layout UI or not, based on the layout mode
 * 
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
export default async function HomepageLayout({
	children
}: {
	children: React.ReactNode
}) {
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	/**----------------------------------- */
	// LAYOUT MODE 1: RETURN COMIC LANDING PAGE UI
	if (frontpage_comic) {
		const comic = await getComic(frontpage_comic.slug)
		return <FrontpageLayoutUI>
			<ComicLayoutUI comic={comic}>
				{children}
			</ComicLayoutUI>
		</FrontpageLayoutUI>
	}

	/**----------------------------------- */
	// LAYOUT MODE 2: RETURN HOMEPAGE PAGE
	else if (!frontpage_comic)
		return <FrontpageLayoutUI>
			{children}
		</FrontpageLayoutUI>
}