"use server"
/**----------------------------------- */
// CMS
import { adminClient } from "@/lib/directus/clients"
import { readSingleton } from "@directus/sdk"

/** ------------------------------------------------ **
 * GET SETTINGS
 */
export async function GetSettings() {
	const request = await adminClient.request(
		readSingleton("settings", {
			fields: [
				"project_title",
				"date_established",
				{ project_authors: ["name", "username", "homepage_url"] },
				"project_url",
				"project_description",
				// "project_thumbnail",
				{ project_thumbnail: ["filename_disk", "type", "width", "height"] },
				{ project_svg_icon: ["filename_disk", "type", "width", "height"] },
				{ project_apple_icon: ["filename_disk", "type", "width", "height"] },
				{ project_pwa_icon: ["filename_disk", "type", "width", "height"] },
			],
		}),
	)
	return request
}
