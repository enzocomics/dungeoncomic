"use server"
/**----------------------------------- */
// CMS
import { adminClient, publicClient } from "@/lib/directus/clients"
import { readItems } from "@directus/sdk"
import { cache } from "react"

/** ------------------------------------------------ **
 * GET COMIC
 */
export const getComic = cache(
	async ({ slug, limit = 1 }: { slug?: string; limit?: number }) => {
		const request = await publicClient.request(
			readItems("comics", {
				filter: slug
					? {
							slug: { _eq: slug },
						}
					: undefined,
				limit: limit,
				fields: [
					// Details
					"title",
					"description",
					"slug",
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
					{
						logo: ["filename_disk", "type", "width", "height", "description"],
					},
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
						banner: ["filename_disk", "type", "width", "height", "description"],
					},
					"accent_color",
					"display_font",
					"copy_font",
					// Content
					"landing_page",
					"landing_page_content",
					"start_button_text",
					// Meta
					"id",
					"count(pages)",
				],
			}),
		)
		return request?.[0]
	},
)

/** ------------------------------------------------ **
 * GET SINGLE COMIC PAGE
 */
export const getComicPage = cache(async (comic_slug: string, num: number) => {
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
				"comic_pagenum",
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
								"value_prefix",
								"value_suffix",
								"prompt",
								"description",
								"id",
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
						"id",
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
						{
							pages_id: [
								"title",
								"subtitle",
								"comic",
								"comic_pagenum",
								"status",
							],
						},
						{
							linked_pages_id: [
								"title",
								"subtitle",
								"comic",
								"comic_pagenum",
								"status",
							],
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
								"status",
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
												"value_prefix",
												"value_suffix",
												"prompt",
												"description",
												"id",
											],
										},
										"place_after_variables_submitted",
									],
								},
								"variables_submit_button_text",
							],
						},
						{
							linked_pages_id: [
								"title",
								"subtitle",
								"comic",
								"comic_pagenum",
								"status",
							],
						},
						"sort",
					],
				},
				// Meta
				"id",
				{
					comic: [
						"slug",
						"title",
						"description",
						"accent_color",
						{ authors: ["username"] },
						{
							logo: ["filename_disk", "type", "width", "height", "description"],
						},
						{
							banner: [
								"filename_disk",
								"type",
								"width",
								"height",
								"description",
							],
						},
						{
							thumbnail: [
								"filename_disk",
								"type",
								"width",
								"height",
								"description",
							],
						},
						// Meta
						"date_created",
						"date_updated",
						"landing_page",
					],
				},
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
			deep: {
				plot_suggestions: {
					_sort: ["sort", "id"],
				},
				prev_pages: {
					_sort: ["sort", "id"],
				},
				next_pages: {
					_sort: ["sort_next", "id"],
				},
			},
		}),
	)
	return request[0]
})

/** ------------------------------------------------ **
 * GET COMIC VARIABLES
 */

export async function getComicVariables(slug?: string) {
	const request = slug
		? await publicClient.request(
				readItems("variables", {
					// TODO: We should probably eventually put a limit on this
					limit: -1,
					fields: [
						"name",
						"slug",
						"default_value",
						"value_prefix",
						"value_suffix",
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
		: null
	return request
}
