"use server"
/**----------------------------------- */
// LIBRARIES
import {
	createItem,
	deleteItem,
	readItem,
	readItems,
	updateItem,
} from "@directus/sdk"
// DATA
import { verifySession } from "@/data/session"
import { adminClient, userClient } from "@/lib/directus/clients"
import { getComicPage } from "@/lib/directus/get-comics"
import { parseWithZod } from "@conform-to/zod/v4"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
import { sanitize } from "@/lib/sanitize"

export type PlotSuggestionType =
	| NonNullable<
			Awaited<ReturnType<typeof getComicPage>>["plot_suggestions"]
	  >[number]
	| null

/**----------------------------------- */
export async function voteOnPlotSuggestion({
	vote,
	// newVoteID,
	page,
	user,
}: {
	vote?: PlotSuggestionType
	// newVoteID: number
	page: Awaited<ReturnType<typeof getComicPage>>
	user: Awaited<ReturnType<typeof verifySession>>
}) {
	const newVote = vote
	// If the newVoteID is 0, it means the user has selected to add their own suggestions.
	// This means we should only remove old votes without adding a new one
	try {
		// Get all the plot suggestions on this page
		const plotSuggestions = await userClient.request(
			readItems("plot_suggestions", {
				filter: {
					page: {
						_eq: page.id as number,
					},
				},
				fields: ["id", "title", "slug", "users_voted"],
			}),
		)

		// Check if the user has already voted on anything
		const oldVote =
			user &&
			plotSuggestions.find((object) => object.users_voted.includes(user.id))

		// Get the user id from the oldvote. remove it
		const removeUserFromOldVote = oldVote?.users_voted.filter(
			(id) => id !== user?.id,
		)

		// Add the user id to the list of voters on the new vote
		// - check if there's any values in the new vote, otherwise just give an empty array
		// - spread operator includes the previous array
		// - then add the new id at the end
		const addUserToNewVote = [...(newVote?.users_voted || []), user?.id]

		// If the vote is undefined AND there is an old vote, delete old vote only
		if (newVote == undefined && oldVote) {
			// console.log("user submits their own thing. delete old vote ONLY")
			const response = await userClient.request(
				updateItem("pages", page.id as number, {
					plot_suggestions: [
						...plotSuggestions, // Include all the old suggestions
						{
							id: oldVote.id,
							title: oldVote.title,
							slug: oldVote.slug,
							users_voted: removeUserFromOldVote,
						},
					],
				}),
			)
			// console.log(response)
		}
		// If there's a new AND  an old vote, make sure to delete the old one first
		else if (newVote && oldVote) {
			// console.log("delete previous vote and vote for ", newVote.title)
			const response = await userClient.request(
				updateItem("pages", page.id as number, {
					plot_suggestions: [
						...plotSuggestions,
						{
							id: oldVote.id,
							title: oldVote.title,
							slug: oldVote.slug,
							users_voted: removeUserFromOldVote,
						},
						{
							id: newVote.id,
							title: newVote.title,
							slug: newVote.slug,
							users_voted: addUserToNewVote,
						},
					],
				}),
			)
			// console.log(response)
		}
		// Otherwise, just submit the new vote
		else if (newVote && !oldVote) {
			// console.log("only vote for", newVote.title)
			const response = await userClient.request(
				updateItem("pages", page.id as number, {
					plot_suggestions: [
						...plotSuggestions,
						{
							id: newVote.id,
							title: newVote.title,
							slug: newVote.slug,
							users_voted: addUserToNewVote,
						},
					],
				}),
			)
			// console.log(response)
		}
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		console.log("error:", error)
		return { error, reason }
	}
}

/**----------------------------------- */
export async function deleteUserPlotSuggestion(id: number) {
	try {
		const deleteSuggestion = await userClient.request(
			deleteItem("plot_suggestions", id),
		)
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return { error }
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
				title: sanitize(userSuggestion),
				slug: slug,
				page: pageId,
				votes: 1,
				users_voted: [{ id: userId }],
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
