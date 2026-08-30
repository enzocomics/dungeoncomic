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
				{
					authors: [
						"id",
						"email",
						"name",
						"username",
						"avatar",
						"homepage_url",
					],
				},
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
				"display_font",
				"copy_font",
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

/** ------------------------------------------------ **
 * GET SINGLE COMIC PAGE
 */
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
				"status",
				"title",
				"subtitle",
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
				// Content
				{
					comic_panels: [
						// Content
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
						// User Input
						{
							variables: [
								"name",
								"slug",
								"default_value",
								"description",
								"prompt",
							],
						},
						"place_after_variables_submitted",
					],
				},
				"variables_submit_button_text",
				// Feedback
				"plot_prompt",
				"allow_user_suggestions",
				{
					plot_suggestions: [
						"title",
						"slug",
						{
							users_voted: [
								"id",
								"email",
								"name",
								"username",
								"avatar",
								"homepage_url",
							],
						},
						"votes",
						{
							user_created: [
								"id",
								"email",
								"name",
								"username",
								"avatar",
								"homepage_url",
							],
						},
						"date_created",
						{
							user_updated: [
								"id",
								"email",
								"name",
								"username",
								"avatar",
								"homepage_url",
							],
						},
						"date_updated",
					],
				},
				"allow_user_comments",
				// Navigation
				{
					next_pages: [
						{ pages_id: ["title", "subtitle", "comic", "comic_pagenum"] },
						{
							linked_pages_id: ["title", "subtitle", "comic", "comic_pagenum"],
						},
					],
				},
				{
					prev_pages: [
						{
							pages_id: [
								"title",
								"subtitle",
								"comic",
								"comic_pagenum",
								{
									comic_panels: [
										// Content
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
										// User Input
										{
											variables: [
												"name",
												"slug",
												"default_value",
												"description",
												"prompt",
											],
										},
										"place_after_variables_submitted",
									],
								},
								"variables_submit_button_text",
							],
						},
						{
							linked_pages_id: ["title", "subtitle", "comic", "comic_pagenum"],
						},
					],
				},
				// Meta
				{ comic: ["slug", "title"] },
				{
					user_created: [
						"id",
						"email",
						"name",
						"username",
						"avatar",
						"homepage_url",
					],
				},
				{
					user_updated: [
						"id",
						"email",
						"name",
						"username",
						"avatar",
						"homepage_url",
					],
				},
				"date_created",
				"date_updated",
			],
		}),
	)
	return request[0]
}

/** ------------------------------------------------ **
 * GET COMIC VARIABLES
 */

export async function getComicVariables(slug: string) {
	const request = await publicClient.request(
		readItems("variables", {
			// TODO: We should probably eventually put a limit on this
			limit: -1,
			fields: [
				"name",
				"slug",
				"default_value",
				// This is required if we want to apply a deep filter
				{
					panel_id: [{ page_id: [{ comic: ["slug"] }] }],
				},
			],
			// Deep filter that goes through each relation to find the value we want to compare to (in this case, the parent comic's slug)
			deep: {
				panel_id: {
					page_id: {
						comic: {
							_filter: {
								slug: {
									_eq: slug,
								},
							},
						},
					},
				},
			},
		}),
	)
	return request
}
