"use server"
/**----------------------------------- */
// LIBRARIES
import { readItem, readItems, updateItem } from "@directus/sdk"
// DATA
import { verifySession } from "@/data/session"
import { userClient } from "@/lib/directus/clients"
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

		console.log("newVote:", getNewVote)

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

		// const userVotedOn =
		// 	user &&
		// 	plotSuggestions.find((object) => object.users_voted?.includes(user))?.id
		// console.log("suggestion:", plotSuggestions[2])
		// console.log("userVotedOn:", userVotedOn)
		// const userAlreadyVoted =
		// 	plotSuggestion.users_voted && user
		// 		? plotSuggestion.users_voted.includes(user)
		// 		: false
		// console.log(userAlreadyVoted)

		// console.log(plotSuggestion)
		// console.log(user)

		// console.log(getRequest)

		// const voteRequest = await userClient.request(
		// 	updateItem("plot_suggestions", id, {
		// 		votes: +1,
		// 	}),
		// )
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
	const submission = parseWithZod(formData, { schema: userSuggestionSchema() })

	return submission.reply()
}
