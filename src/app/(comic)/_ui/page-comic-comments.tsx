"use client"
/**----------------------------------- */
// LIBRARIES
import { ComponentPropsWithoutRef, useActionState, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { Button, Field, } from "@headlessui/react"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
// FUNCTIONS
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// DATA
import { verifySession } from "@/data/session"
import { getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { getComments } from "@/lib/directus/get-comments"
import { userCommentSchema } from "@/lib/zod/schemas/comic"
// ACTIONS
import { submitUserComment } from "../_actions/comments"
// UI
import { ErrorMessage } from "@/components/error-message"
import { ComicButton, SmallComicButton } from "@/components/button"
import { Textarea } from "@/components/textarea"
import Image from "next/image"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"
import { detailedDate, relativeDate } from "@/lib/dayjs"
import replaceComicVariables from "../_functions/replace-comic-vars"
import { AuthLink } from "@/components/auth"


/**-----------------------------------
 * Comments Section UI
 * ---
 */
export function CommentsSection({
	page,
	comments,
	session,
	variables,
	userVariables
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	comments: Awaited<ReturnType<typeof getComments>>
	session: Awaited<ReturnType<typeof verifySession>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
}) {

	// Do not display marked images
	marked.use({
		renderer: {
			image() {
				return ""
			}
		}
	})

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
		{/* ROOT COMMENT FORM */}
		{page.allow_user_comments && !isReplying &&
			<section className={
				clsx(
					"mt-8",
					"pt-8",
					"pb-12",
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
					<CommentForm />
				</div>
			</section>
		}
		{/* COMMENT LIST SECTION */}
		{
			comments && comments.length > 0 &&
			<section className={clsx(
				"mt-8",
				"pt-10",
				"pb-12",
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
						"sm:px-6",
						"mx-auto",
						"w-full",
						"max-w-2xl",
					)
				}
				>
					<h1 className={clsx(
						"px-6",
						"sm:px-0",
						"text-xl",
						"font-comic-header",
						"font-semibold",
						"w-full",
						"pb-2",
					)}>{t("comments")} ({comments.length})</h1>

					<CommentList className={clsx(
						"w-full",
						"flex",
						"flex-col",
						"gap-2",
					)}>
						{comments.map((c, index) => (
							<CommentListItem comment={c} key={index} className={
								clsx(
									"bg-neutral-100",
									"dark:bg-neutral-800/60",
									"sm:rounded",
								)
							}>

								{/* USER/MODERATOR PANEL */}
								{session && c.user_created.id == session.id &&
									<div className={
										clsx(
											"hidden", // TODO: buttons
											"text-xs",
											"text-base-content/50",
											"flex",
											"gap-2",
										)
									}>
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
									</div>
								}

								{/* Only allow 1 level of replies */}
								{c.children_comments && c.children_comments.length > 0 &&

									<div className={
										clsx(
											"rounded",
											"mt-6",
											"mx-2",
											"border-t-4",
											"border-neutral-300",
											"bg-neutral-400/20",
											"dark:border-neutral-900",
											"dark:bg-neutral-900/50",
										)
									}>
										<CommentList className={
											clsx(
												"rounded",
												"relative",
												"ml-4",
												"px-4",

												"flex",
												"flex-col",
												"gap-2",
												"before:absolute",
												"before:w-4",
												"before:-translate-x-4",

												"before:h-full",
												"before:border-l-4",
												"before:border-neutral-300",
												"dark:before:border-neutral-900",
											)
										}>
											{c.children_comments.map((cc, cindex) => (
												<CommentListItem comment={cc} key={cindex} className={
													clsx(
														"first:mt-4",
														"last:mb-4",
														"pb-8",
														"relative",
														"rounded",
														"bg-neutral-100",
														"dark:bg-neutral-800/50",
														"before:absolute",
														"last:before:bg-[#e4e4e4]",
														"dark:last:before:bg-[#1b1b1c]",
														"before:w-4",
														"before:h-[calc(50%+16px)]",
														"before:-left-4",
														"before:top-1/2",
														"before:border-t-4",
														"before:border-neutral-300",
														"dark:before:border-neutral-900",
													)
												}>
												</CommentListItem>
											))}
										</CommentList>
									</div>
								}

								{/* REPLY BUTTON */}
								<div className={
									clsx(
										"flex",
										"flex-row",
										"px-4",
										"py-4",
									)
								}>
									{userCanCreate &&
										<>{(!isReplying || !(isReplying && isReplying == c.id)) &&
											<SmallComicButton
												onClick={() => {
													setIsReplying(c.id)
												}}
												icon={{ name: "reply", position: "right" }}
												className="ml-auto"
											>
												{t("reply")}
											</SmallComicButton>
										}
											{isReplying && isReplying == c.id &&
												<SmallComicButton
													onClick={() => {
														setIsReplying(null)
													}}
													icon={{ name: "xmark", position: "right" }}
													color="red"
													className="ml-auto"
												>
													{t("cancel-reply")}
												</SmallComicButton>
											}
										</>
									}
								</div>

								{isReplying && isReplying == c.id &&
									<div className={
										clsx(
											"m-4",
											"mt-0",
											"rounded",
											"bg-base-1",
											"dark:bg-base-2",
											"p-4",
											"animate-fade-in",
										)
									}>
										<CommentForm />
									</div>
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


		// Textarea length checker
		const [inputLength, setInputLength] = useState(0)

		return <>
			<form
				id={form.id}
				onSubmit={form.onSubmit}
				action={action}
				noValidate
				className={
					clsx(
						"w-full",
						"animate-fade-in",
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
							"relative",
							"w-full",
						)
					}
				>
					<label
						htmlFor={fields.content.name}
						className={clsx(
							"relative",
							"block",
							"font-comic-header",
							"font-semibold",
							isReplying
								? "text-base"
								: "text-xl",
							"pb-2",
						)}
					>
						{/* Reply to "username" */}
						{isReplying ? `${t("reply-to")} ${comments.find(comment => comment.id === isReplying)?.user_created.username}` : t("write-comment")}
					</label>
					{/* Length Checker */}
					<span className={clsx(
						"absolute",
						"top-2.5",
						"right-0",
						"ml-auto",
						"font-comic-header",
						"font-normal",
						"text-xs",
						"text-current/50"
					)}>
						{`${inputLength}/1024`}{/* TODO: should this be hardcoded? */}

					</span>
					{(!session || !userCanCreate) &&
						// You don't have permissions" Message
						<span className={
							clsx(
								"absolute",
								"bottom-4",
								"left-4",
								"cursor-not-allowed",
								"font-platform-mono",
								"text-neutral-500",
							)
						}>
							{session && !userCanCreate && t("permission-no-comments")}
							{!session && t.rich("please-login-to-comment", {
								loginLink: (chunks) => <AuthLink modal="login" className="text-comic-accent-500">{chunks}</AuthLink>
							})}
						</span>
					}
					<Textarea
						id={fields.content.name}
						name={fields.content.name}
						key={fields.content.key}
						className={clsx(
						)}
						maxLength={1024}
						onChange={(e) => {
							setInputLength(e.target.value.length)
						}}
						disabled={
							userCanCreate
								? false : true
						}
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
				<ComicButton
					as="button"
					type={userCanCreate ? "submit" : undefined}
					disabled={
						userCanCreate ? false : true
					}
				>
					{isReplying ? t("submit-reply") : t("submit-comment")}
				</ComicButton>
			</form>
		</>
	}


	function CommentListItem({
		comment,
		...props
	}: ComponentPropsWithoutRef<"li"> & {
		comment: Awaited<ReturnType<typeof getComments>>[number]
	}) {
		const c = comment
		return (
			<li
				{...props}
				className={
					clsx(
						props.className,
					)
				}
			>
				<section className={
					clsx(
						"p-6",
						// "lg:p-4",
						"pb-0",
						"grid",
						"grid-cols-[24px_1fr]",
						"grid-rows-[24px_1fr]",
						"gap-x-2",
						"gap-y-2",
						"lg:gap-x-4",
						"lg:grid-cols-[48px_1fr]",
						"lg:grid-rows-[48p_1fr]",
					)
				}>
					{c.user_created.avatar &&
						<Image
							src={`${directusURL}/assets/${c.user_created.avatar.filename_disk}`}
							alt={c.user_created.avatar.description || ""}
							width={c.user_created.avatar.width}
							height={c.user_created.avatar.height}
							className={
								clsx(
									"row-span-1",
									"size-6",
									"rounded-lg",
									"lg:size-12",
									"lg:row-span-2",
								)
							}
						/>
					}
					{!c.user_created.avatar &&
						<Icon name="skull"
							className={
								clsx(
									"text-white",
									"p-1",
									"lg:p-3",
									"row-span-1",
									"size-6",
									"rounded-lg",
									"bg-neutral-600",
									"lg:size-12",
									"lg:row-span-2",
								)
							}
						/>
					}
					<div className={
						clsx(
							"text-xs",
							"text-base-content/50",
							"flex",
							"items-center",
							"gap-x-1",
						)
					}>
						<strong className={
							clsx(
							)
						}>
							{c.user_created.username}
						</strong>
						<span className={
							clsx(
							)
						}>
							∙
						</span>
						<time
							dateTime={new Date(c.date_created).toISOString()}
							title={detailedDate(new Date(c.date_created))}
							className={
								clsx(
									"cursor-help"
								)
							}>
							{relativeDate(new Date(c.date_created))}
						</time>
					</div>
					<div className={
						clsx(
							"col-span-2",
							"lg:col-span-1",
							"prose",
						)
					}
						dangerouslySetInnerHTML={{
							__html:
								replaceComicVariables({
									content: String(
										marked.parse(
											sanitize(c.content)
										)
									),
									variables: variables,
									userVariables: userVariables,
									html: true
								}),

						}} />

				</section>
				{props.children}
			</li>
		)
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
