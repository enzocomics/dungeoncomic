"use server"
/**----------------------------------- */
// CMS
import { adminClient, publicClient } from "@/lib/directus/clients"
import { readItems } from "@directus/sdk"

/** ------------------------------------------------ **
 * GET COMIC
 */
export async function getComic(slug: string) {
	const request = await publicClient.request(
		readItems("comics", {
			filter: {
				slug: { _eq: slug },
			},
			limit: 1,
			fields: [
				// Details
				"title",
				"description",
				{ authors: ["name", "username", "homepage_url", "email"] },
				// Appearance
				{ logo: ["filename_disk", "type", "width", "height", "description"] },
				{
					thumbnail: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{ banner: ["filename_disk", "type", "width", "height", "description"] },
				"accent_color",
				// Content
				// Settings
				"landing_page",
				// Meta
				"id",
				"count(pages)",
			],
		}),
	)
	return request[0]
}

export async function getComicPage(comic_slug: string, num: number) {
	const request = await publicClient.request(
		readItems("pages", {
			filter: {
				comic: {
					slug: {
						_eq: comic_slug,
					},
				},
				comic_pagenum: {
					_eq: num,
				},
			},
			limit: 1,
			fields: [
				// Details
				"title",
				"description",
				{
					thumbnail: [
						"filename_disk",
						"type",
						"width",
						"height",
						"description",
					],
				},
				{
					comic_panels: [
						{
							panel_image: [
								"filename_disk",
								"type",
								"width",
								"height",
								"description",
							],
						},
						"panel_title",
						"panel_description",
					],
				},
				{
					next_pages: [
						"branch_title",
						"branch_description",
						{ pages_id: ["comic", "comic_pagenum"] },
						{ linked_pages_id: ["comic", "comic_pagenum"] },
					],
				},
				{
					prev_pages: [
						"branch_title",
						"branch_description",
						{ pages_id: ["comic", "comic_pagenum"] },
						{ linked_pages_id: ["comic", "comic_pagenum"] },
					],
				},
			],
		}),
	)
	return request[0]
}
