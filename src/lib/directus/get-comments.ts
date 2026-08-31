"use server"
/**----------------------------------- */
// CMS
import { adminClient, publicClient } from "@/lib/directus/clients"
import { readItems } from "@directus/sdk"

/** ------------------------------------------------ **
 * GET COMMENTS
 */
export async function getComments(pageId: number) {
	const request = await publicClient.request(
		readItems("comments", {
			filter: {
				parent_page: { _eq: pageId },
			},
			limit: -1,
			sort: ["-date_created"],
			deep: {
				children_comments: {
					_sort: ["date_created"],
				},
			},
			fields: [
				// Root Comment - Details
				"content",
				// Root Comment- Relational
				"parent_page",
				"parent_comment",
				// Child Comments
				{
					children_comments: [
						"content",
						"parent_page",
						"parent_comment",
						// Child Comment - Meta
						{
							user_created: [
								"id",
								"email",
								"username",
								"homepage_url",
								{
									avatar: [
										"filename_disk",
										"type",
										"width",
										"height",
										"description",
									],
								},
							],
						},
						"date_created",
						{
							user_updated: [
								"id",
								"email",
								"username",
								"homepage_url",
								{
									avatar: [
										"filename_disk",
										"type",
										"width",
										"height",
										"description",
									],
								},
							],
						},
						"date_updated",
					],
				}, // eo child commments
				// Root Comment - Meta
				{
					user_created: [
						"id",
						"email",
						"username",
						"homepage_url",
						{
							avatar: [
								"filename_disk",
								"type",
								"width",
								"height",
								"description",
							],
						},
					],
				},
				"date_created",
				{
					user_updated: [
						"id",
						"email",
						"username",
						"homepage_url",
						{
							avatar: [
								"filename_disk",
								"type",
								"width",
								"height",
								"description",
							],
						},
					],
				},
				"date_updated",
			],
		}),
	)
	return request
}
