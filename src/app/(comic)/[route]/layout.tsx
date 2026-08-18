import { getSettings } from "@/lib/directus/get-settings"
import { ComicLayoutUI } from "../_layout-ui"

/**-----------------------------------
 * ROUTE LAYOUT
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
export default async function RouteLayout({
	children
}: {
	children: React.ReactNode
}) {
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	/**----------------------------------- */
	// LAYOUT MODE 1 - FRONTPAGE COMIC
	// - We are displaying the comic layout in the root already
	if (frontpage_comic)
		return { children }

	/**----------------------------------- */
	// LAYOUT MODE 2 - HOMEPAGE
	// - Display comic layout UI
	if (!frontpage_comic)
		return <ComicLayoutUI>
			{children}
		</ComicLayoutUI>

}