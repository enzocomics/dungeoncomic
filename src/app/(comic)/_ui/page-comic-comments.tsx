"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { verifySession } from "@/data/session"
import { getComicPage } from "@/lib/directus/get-comics"
import { getComments } from "@/lib/directus/get-comments"
// UI
import { Button, Field, } from "@headlessui/react"
import { ErrorMessage } from "@/components/catalyst/fieldset"
// import { Textarea } from "@/components/catalyst/textarea"
import { Textarea } from "@/components/textarea"
import { ComponentPropsWithoutRef, useActionState, useEffect, useState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import { userCommentSchema } from "@/lib/zod/schemas/comic"
import { submitUserComment } from "../_actions/comments"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
	// HOOKS
	const router = useRouter()
	// TRANSLATIONS
	const t = useTranslations("Comments")

	// BOOLEANS
	const [isReplying, setIsReplying] = useState<number | null>(null)

	// PERMISSIONS
	const userCanCreate = session?.permissions?.comments?.create?.access === "full"
	const userCanUpdate = session?.permissions?.comments?.update?.access === "full"
	const userCanDelete = session?.permissions?.comments?.delete?.access === "full"

	// RENDER
	return <>
		{/* Show the initial form if comments are allowed and it's not a reply */}
		{page.allow_user_comments && !isReplying &&
			<section className={clsx(
				"mt-8",
				"py-6",
				"bg-base-1",
				"dark:bg-base-2",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-base-5/50",
				"md:rounded",
				"flex",
				"flex-col",
				"items-center",
			)}>
				<div className={
					clsx(
						"px-6",
						"mx-auto",
						"w-full",
						"max-w-2xl",
					)
				}
				>
					{!session &&
						<h4>{t.rich("please-login-to-comment", {
							loginLink: (chunks) => <Link href="/login">{chunks}</Link>
						})}</h4>
					}
					{!userCanCreate &&
						<h4>{t("permission-no-comments")}</h4>
					}
					<CommentForm />
				</div>
			</section>
		}
		{
			comments && comments.length > 0 &&
			<section className={clsx(
				"mt-8",
				"py-6",
				"bg-base-1",
				"dark:bg-base-2",
				"dark:shadow-none",
				"dark:outline",
				"dark:-outline-offset-1",
				"dark:outline-base-5/50",
				"md:rounded",
				"flex",
				"flex-col",
				"items-center",
			)}>
				<div className={
					clsx(
						"px-6",
						"mx-auto",
						"w-full",
						"max-w-2xl",
					)
				}
				>
					<h1 className={clsx(
						"text-lg",
						"font-comic-header",
						"font-semibold",
						"w-full",
					)}>{t("comments")} ({comments.length})</h1>

					<CommentList className={clsx(
						"w-full",
						"flex",
						"flex-col",
						"gap-2",
					)}>
						{comments.map((c, index) => (
							<CommentListItem key={index} className={
								clsx(
									"bg-base-2/25",
									"dark:bg-base-4/50",
									"md:rounded",
									"p-4",
								)
							} >
								<p>{c.user_created.username} {t("commented-on")} {c.date_created}:</p>
								{c.content}


								{session && c.user_created.id == session.id &&
									<>
										{userCanUpdate &&
											<Button>
												{t("edit-comment")}
											</Button>
										}
										{userCanDelete &&
											<Button>
												{t("delete-comment")}
											</Button>
										}
									</>
								}

								{/* Only allow 1 level of replies */}
								{c.children_comments && c.children_comments.length > 0 &&
									<ul className={clsx(
										"mx-4",
										"mt-4",
										"mb-2",
										"flex",
										"flex-col",
										"gap-2",
									)}>
										{c.children_comments.map((cc, cindex) => (
											<li key={cindex} className={
												clsx(
													"p-4",
													"bg-base-2/25",
													"dark:bg-base-4/50",
													"rounded",
												)
											}>
												{/* TODO: Dictionaries */}
												<p>{cc.user_created.username} {t("commented-on")} {cc.date_created}:</p>
												{cc.content}
											</li>
										))}
									</ul>
								}

								{userCanCreate &&
									<div className={
										clsx(
											"text-right"
										)
									}>
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
									</div>
								}
								{isReplying && isReplying == c.id &&

									<CommentForm />

								}

							</CommentListItem>

						))}
					</CommentList >
				</div>
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
				className={
					clsx(
						"w-full",
					)
				}
			>
				<Field
					disabled={
						userCanCreate
							? false : true
					}
					className={
						clsx(
							"w-full",
						)
					}
				>
					<label
						htmlFor={fields.content.name}
						className={clsx(
							"font-comic-header",
							"font-semibold",
							"text-lg",
						)}
					>
						{/* TODO: reply to "username" */}
						{isReplying ? `${t("reply-to")} ${isReplying}` : t("write-comment")}
					</label>
					<Textarea
						id={fields.content.name}
						name={fields.content.name}
						key={fields.content.key}
						className={clsx(
						)}
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

function CommentList(props: ComponentPropsWithoutRef<"ul">) {
	return (
		<ul
			{...props}
		>
			{props.children}
		</ul>
	)
}

function CommentListItem(props: ComponentPropsWithoutRef<"li">) {
	return (
		<li
			{...props}
		>
			{props.children}
		</li>
	)
}