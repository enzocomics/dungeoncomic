import { GetSettings } from "@/lib/directus/get-settings"
import type { MetadataRoute } from "next"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const fallbackTitle = "DungeonConstruction Co."
	const fallbackShortTitle = "Dungeon"
	const fallbackDescription = "We Build Adventure"

	const settings = await GetSettings()

	return {
		name: settings.project_title || fallbackTitle,
		short_name: settings.project_title || fallbackShortTitle,
		description: settings.project_description || fallbackDescription,
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
				purpose: "maskable",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
		display: "standalone",
	}
}
