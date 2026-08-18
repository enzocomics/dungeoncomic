import { getSettings } from "@/lib/directus/get-settings"
import { ComicLayoutUI } from "../_layout-ui"

export default async function RouteLayout({
	children
}: {
	children: React.ReactNode
}) {
	// CHECK IF `frontpage_comic` HAS BEEN SET
	const settings = await getSettings()
	const frontpage_comic = settings.frontpage_comic

	/**----------------------------------- */
	// IF `frontpage_comic` EXISTS 
	if (frontpage_comic) {
		return <>{children}</>
	}

	/**----------------------------------- */
	// IF `frontpage_comic` DOES NOT EXIST
	if (!frontpage_comic) {
		return <>
			<ComicLayoutUI>
				{children}
			</ComicLayoutUI>
		</>
	}
}