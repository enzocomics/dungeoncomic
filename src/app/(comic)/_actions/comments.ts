"use server"
import { userClient } from "@/lib/directus/clients"
import { userCommentSchema } from "@/lib/zod/schemas/comic"
import { parseWithZod } from "@conform-to/zod/v4"
import { createItem } from "@directus/sdk"

export async function submitUserComment(
	prevState: unknown,
	formData: FormData,
) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: userCommentSchema() })

	const content = formData.get("content") as string
	const pageId = parseInt(formData.get("pageId") as unknown as string)
	const userId = formData.get("userId") as string

	// SUBMIT USER SUGGESTION TO DIRECTUS
	try {
		const addComment = await userClient.request(
			createItem("comments", {
				content: content,
				parent_page: pageId,
			}),
		)
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}
	// RETURN REPLY so that its last value may be used
	return submission.reply()
}
