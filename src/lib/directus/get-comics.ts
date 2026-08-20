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
				{ logo: ["filename_disk", "type", "width", "height"] },
				{ thumbnail: ["filename_disk", "type", "width", "height"] },
				{ banner: ["filename_disk", "type", "width", "height"] },
				"accent_color",
				// Content
				// Meta
				"id",
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
					comic_panels: [
						{ panel_image: ["filename_disk", "type", "width", "height"] },
						"panel_title",
						"panel_description",
					],
				},
			],
		}),
	)
	return request[0]
}
