"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { verifySession } from "@/data/session"
import { getComicPage } from "@/lib/directus/get-comics"
import { getComments } from "@/lib/directus/get-comments"
// UI
import { Button } from "@/components/button"
import { ErrorMessage, Field } from "@/components/fieldset"
import { Textarea } from "@/components/textarea"
import { useActionState, useEffect } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { userCommentSchema } from "@/lib/zod/schemas/comic"
import { submitUserComment } from "../_actions/comments"
import { useRouter } from "next/navigation"


/**-----------------------------------
 * Comments Section UI
 * ---
 */
export function CommentsSection({
	page,
	comments,
	session
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	comments: Awaited<ReturnType<typeof getComments>>
	session: Awaited<ReturnType<typeof verifySession>>
}) {
	const router = useRouter()
	// VALIDATION
	const [lastResult, action] = useActionState(submitUserComment, undefined)
	const [form, fields] = useForm({
		// Sync the result with the last su8bmission
		lastResult,

		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: userCommentSchema() })
		},

		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})
	// EFFECT: on submit
	useEffect(() => {
		if (lastResult?.status == "success") {
			router.refresh()
		}
	}, [lastResult])

	return <>
		{page.allow_user_comments &&

			<section className={clsx(
				"mt-8",
				"bg-base-1",
				"p-2",
			)}>
				{!session &&
					<h4>You must be logged in to make a comment!</h4>
				}
				<form
					id={form.id}
					onSubmit={form.onSubmit}
					action={action}
					noValidate
				>
					<Field disabled={session ? false : true}>
						<label className={clsx(
							"text-xl"
						)}>Make a Comment</label>
						<Textarea
							id={fields.content.name}
							name={fields.content.name}
							key={fields.content.key}
						/>
						<ErrorMessage>{fields.content.errors}</ErrorMessage>
						{session &&
							<>
								<input
									name={fields.pageId.name}
									key={fields.pageId.key}
									type="hidden"
									value={page.id.toString()}
								/>
								<input
									name={fields.userId.name}
									key={fields.userId.key}
									type="hidden"
									value={session.id}
								/>
							</>
						}
					</Field>
					<Button type="submit">Submit</Button>
				</form>
			</section>
		}
		{comments && comments.length > 0 &&
			<section className={clsx(
				"mt-8"
			)}>
				<h4 className={clsx(
					"text-xl"
				)}>Comments</h4>
				<ul className={clsx(
					"flex",
					"flex-col",
					"gap-2",
				)}>
					{comments.map((c, index) => (
						<li key={index} className={clsx(
							"bg-base-1"
						)}>
							<p>{c.user_created.username} commented on {c.date_created}:</p>
							{c.content}


							{/* Only allow 1 level of replies */}
							{c.children_comments &&
								<ul className={clsx(
									"ml-4",
									"flex",
									"flex-col",
									"gap-2",
								)}>
									{c.children_comments.map((cc, cindex) => (
										<li key={cindex}>
											<p>{cc.user_created.username} commented on {cc.date_created}:</p>
											{cc.content}
										</li>
									))}
								</ul>
							}

						</li>
					))}
				</ul>
			</section>
		}
	</>
}