"use server"
/**----------------------------------- */
// CMS
import { adminClient } from "@/lib/directus/clients"
import { readSingleton } from "@directus/sdk"
import { cacheTag } from "next/cache"
// import { cache } from "react"

/** ------------------------------------------------ **
 * GET SETTINGS
 */
export const getSettings = async () => {
	"use cache"
	cacheTag("settings")
	const request = await adminClient.request(
		readSingleton("settings", {
			fields: [
				"project_name",
				"date_established",
				"copyright_message",
				{ project_authors: ["name", "username", "homepage_url", "email"] },
				"project_url",
				"project_description",
				{
					project_logo: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					project_banner: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					project_thumbnail: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					project_svg_icon: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					project_apple_icon: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					project_pwa_icon: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					frontpage_comic: [
						"id",
						"title",
						"slug",
						"description",
						{ authors: ["name", "username", "email"] },
						// FONTS
						"font_headers",
						"font_labels",
						"font_copy",
						"font_mono",
					],
				},
				// "single_comic_site",
				"routing_mode",
				"homepage_content",
				// POST TYPES
				"comic_type_name",
				"comic_type_name_plural",
				"comic_type_name_slug",
				"comic_type_name_plural_slug",
				"user_type_name",
				"user_type_name_plural",
				"user_type_name_slug",
				"user_type_name_plural_slug",
				// FONTS
				"font_headers",
				"font_labels",
				"font_copy",
				"font_mono",
			],
		}),
	)
	return request
}
