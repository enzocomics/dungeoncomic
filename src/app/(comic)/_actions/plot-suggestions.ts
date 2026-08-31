"use server"
/**----------------------------------- */
// LIBRARIES
import { createItem, readItem, readItems, updateItem } from "@directus/sdk"
// DATA
import { verifySession } from "@/data/session"
import { adminClient, userClient } from "@/lib/directus/clients"
import { getComicPage } from "@/lib/directus/get-comics"
import { parseWithZod } from "@conform-to/zod/v4"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"

/**----------------------------------- */
export async function voteOnPlotSuggestion({
	newVoteID,
	page,
	user,
}: {
	newVoteID: number
	page: Awaited<ReturnType<typeof getComicPage>>
	user: Awaited<ReturnType<typeof verifySession>>
}) {
	// If the newVoteID is 0, it means the user has selected to add their own suggestions.
	// This means we should only remove old votes without adding a new one
	try {
		// Get info on the new vote
		const getNewVote =
			newVoteID !== 0 &&
			(await userClient.request(
				readItem("plot_suggestions", newVoteID, {
					fields: ["id", "votes", "users_voted"],
				}),
			))

		// Get all the plot suggestions on this page
		const plotSuggestions = await userClient.request(
			readItems("plot_suggestions", {
				filter: {
					page: {
						_eq: page.id,
					},
				},
				fields: ["id", "votes", "users_voted"],
			}),
		)

		// Check if the user has already voted on anything
		const oldVote =
			user !== false &&
			plotSuggestions.find((object) => object.users_voted.includes(user.id))

		// If a vote already exists, remove the user from that old vote, and -1
		if (oldVote) {
			const oldVoteNum = oldVote.votes - 1
			const updateOldVote = await userClient.request(
				updateItem("plot_suggestions", oldVote.id, {
					users_voted: {
						delete: [user.id],
					},
					votes: oldVote.votes - 1,
				}),
			)
		}

		const updateNewVote =
			user !== false &&
			getNewVote &&
			(await userClient.request(
				updateItem("plot_suggestions", newVoteID, {
					votes: getNewVote.votes + 1,
					users_voted: {
						update: [{ id: user.id }],
					},
				}),
			))

		return "yo"
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return { error, reason }
	}
}

/**----------------------------------- */
export async function submitUserPlotSuggestion(
	prevState: unknown,
	formData: FormData,
) {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: userSuggestionSchema() })

	// FORM DATA
	const userSuggestion = formData.get("userSuggestion") as string
	const pageId = parseInt(formData.get("pageId") as unknown as string)
	const slug = formData.get("slug") as string
	const userId = formData.get("userId") as string

	// SUBMIT USER SUGGESTION TO DIRECTUS
	try {
		const userSuggestionRequest = await userClient.request(
			createItem("plot_suggestions", {
				title: userSuggestion,
				slug: slug,
				page: pageId,
				users_voted: [{ id: userId }],
			}),
		)
	} catch (err: any) {
		1
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
