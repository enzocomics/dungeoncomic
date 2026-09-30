"use server"
/**----------------------------------- */
// LIBRARIES
import {
	createItem,
	deleteItem,
	readItem,
	readItems,
	readUser,
	updateItem,
} from "@directus/sdk"
// DATA
import { verifySession } from "@/data/session"
import { adminClient, userClient } from "@/lib/directus/clients"
import {
	getComicPage,
	getComicPageSuggestions,
} from "@/lib/directus/get-comics"
import { parseWithZod, SubmissionResult } from "@conform-to/zod/v4"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
import { sanitize } from "@/lib/sanitize"
import { getUser } from "@/lib/directus/get-users"

// export type PlotSuggestionType =
// 	| NonNullable<Awaited<ReturnType<typeof getComicPageSuggestions>>>[number]
// 	| null

/**----------------------------------- */
export async function voteOnPlotSuggestion({
	vote,
	// newVoteID,
	page,
	user,
}: {
	vote: string | "custom" | null
	// newVoteID: number
	page: Awaited<ReturnType<typeof getComicPage>>
	user: Awaited<ReturnType<typeof verifySession>>
}) {
	const newVote = vote
	// If the vote is "custom", it means the user has selected to add their own suggestions.
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

		// Add the user id to the list of voters on the new vote
		if (user) {
			// If the vote is custom AND there is an old vote, delete old vote only
			if (newVote == "custom" && oldVote) {
				// Detailed Update Syntax:
				// - Prevents concurrency collisions (users voting at the same time will not overwrite each other)
				const detailedResponse = await userClient.request(
					updateItem("plot_suggestions", oldVote.id, {
						users_voted: {
							delete: [user.id],
						},
					}),
				)
			}
			// If there's a new AND  an old vote, make sure to delete the old one first
			else if (newVote && oldVote) {
				// console.log("delete previous vote and vote for ", newVote.title)
				const detailedResponse = await userClient.request(
					updateItem("pages", page.id as number, {
						plot_suggestions: {
							update: [
								{
									id: oldVote.id,
									users_voted: {
										delete: [user.id],
									},
								},
								{
									id: parseInt(newVote),
									users_voted: {
										update: [{ id: user.id }],
									},
								},
							],
						},
					}),
				)
			}
			// Otherwise, just submit the new vote
			else if (newVote && newVote !== "custom" && !oldVote) {
				const detailedResponse = await userClient.request(
					updateItem("plot_suggestions", parseInt(newVote), {
						users_voted: {
							update: [{ id: user.id }],
						},
					}),
				)
			}
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

// /**----------------------------------- */

type actionResult = SubmissionResult<string[]> & {
	data?: Awaited<ReturnType<typeof getComicPageSuggestions>>[number]
}

export async function submitUserPlotSuggestion(
	prevState: actionResult | undefined,
	formData: FormData,
): Promise<actionResult> {
	// VALIDATION
	const submission = parseWithZod(formData, { schema: userSuggestionSchema() })

	// FORM DATA
	const userSuggestion = formData.get("userSuggestion") as string
	const pageId = parseInt(formData.get("pageId") as unknown as string)
	const slug = formData.get("slug") as string
	const userId = formData.get("userId") as string

	// SUBMIT USER SUGGESTION TO DIRECTUS
	try {
		// Get the response
		const response = await userClient.request(
			createItem("plot_suggestions", {
				title: sanitize(userSuggestion),
				slug: slug,
				page: pageId,
				users_voted: [{ id: userId }],
			}),
		)

		// Build the object we will need for correctly mapping to the UI
		const userObject = await getUser(userId)

		const suggestionObject = {
			id: response.id,
			title: response.title,
			slug: response.slug,
			date_created: response.date_created,
			user_created: userObject,
			users_voted: [userObject],
		} as Awaited<ReturnType<typeof getComicPageSuggestions>>[number]

		return {
			...submission.reply(),
			data: suggestionObject,
		}
	} catch (err: any) {
		// RETURN ERROR IF UNSUCCESFUL
		const error = err.errors?.[0]
		const code = error?.extensions?.code
		const reason = error?.message
		return submission.reply({
			formErrors: [reason],
		})
	}
}

export const loadNewVotes = async (page: number) => {
	return await getComicPageSuggestions(page)
}
