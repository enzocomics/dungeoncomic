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
import { useActionState, useEffect, useState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { userCommentSchema } from "@/lib/zod/schemas/comic"
import { submitUserComment } from "../_actions/comments"
import { useRouter } from "next/navigation"
import { Link } from "@/components/link"
import { useTranslations } from "next-intl"


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

	const t = useTranslations("Comments")
	const router = useRouter()

	const [isReplying, setIsReplying] = useState<number | null>(null)


	return <>
		{page.allow_user_comments && !isReplying &&

			<section className={clsx(
				"mt-8",
				"bg-base-1",
				"p-2",
			)}>
				{!session &&
					<h4>{t.rich("please-login-to-comment", {
						loginLink: (chunks) => <Link href="/login">{chunks}</Link>
					})}</h4>
				}

				<CommentForm />

			</section>
		}
		{
			comments && comments.length > 0 &&
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

						<li key={index} className={
							clsx(
								"bg-base-1"
							)
						} >
							<p>{c.user_created.username} commented on {c.date_created}:</p>
							{c.content}


							{session && c.user_created.id == session.id &&
								<>
									<Button>
										{t("edit-comment")}
									</Button>
									<Button>
										{t("delete-comment")}
									</Button>
								</>
							}

							{session &&
								<>
									{(!isReplying || !(isReplying && isReplying == c.id)) &&
										<Button onClick={() => {
											setIsReplying(c.id)
										}}>{t("reply")}</Button>
									}
									{isReplying && isReplying == c.id &&
										<Button onClick={() => {
											setIsReplying(null)
										}}>{t("cancel-reply")}</Button>
									}
								</>
							}



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

							{isReplying && isReplying == c.id &&

								<CommentForm />

							}
						</li>

					))}
				</ul >
			</section >
		}
	</>

	function CommentForm({ parentCommentId = "" }: {
		parentCommentId?: number | ""
	}) {
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
				// setIsReplying(null)
			}
		}, [lastResult])

		return <>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
			>
				<Field disabled={session ? false : true}>
					<label className={clsx(
						"text-xl"
					)}>
						{/* TODO: reply to "username" */}
						{isReplying ? `${t("reply-to")} ${isReplying}` : t("write-comment")}
					</label>
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
							<input
								name="parentCommentId"
								type="hidden"
								value={isReplying ? isReplying : ""}
							/>
						</>
					}
				</Field>
				<Button type="submit">
					{isReplying ? t("submit-reply") : t("submit-comment")}
				</Button>
			</form>
		</>
	}
}