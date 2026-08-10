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
				{ authors: ["name", "username", "homepage_url"] },
				// Appearance
				// Content
				// Meta
				"id",
			],
		}),
	)
	return request[0]
}
