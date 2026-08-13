/**----------------------------------- */
// TYPES
import type { MetadataRoute } from "next"
// DATA
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"

/**-----------------------------------
 * Manifest
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const fallbackTitle = "DungeonConstruction Co."
	const fallbackShortTitle = "Dungeon"
	const fallbackDescription = "We Build Adventure"

	const settings = await getSettings()

	const pwaIcon192 = settings.project_pwa_icon
		? `${directusURL}/assets/${settings.project_pwa_icon.filename_disk}?width=192&height=192`
		: "/icon-192.png"

	const pwaIcon512 = settings.project_pwa_icon
		? `${directusURL}/assets/${settings.project_pwa_icon.filename_disk}?width=512&height=512`
		: "/icon-512.png"

	return {
		name: settings.project_name || fallbackTitle,
		short_name: settings.project_name || fallbackShortTitle,
		description: settings.project_description || fallbackDescription,
		icons: [
			{
				src: pwaIcon192,
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: pwaIcon512,
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		display: "standalone",
	}
}
