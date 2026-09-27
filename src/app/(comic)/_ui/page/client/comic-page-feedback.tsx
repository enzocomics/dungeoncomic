"use client"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod/v4"
import Form from "next/form"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { getComicPage, getComicPageSuggestions, getComicVariables } from "@/lib/directus/get-comics"
import { verifySession } from "@/data/session"
// FUNCTIONS
import { sanitize } from "@/lib/sanitize"
import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
import { checkHasPlotSuggestions } from "@/app/(comic)/_functions/check-pages"
import { replaceComicVariables } from "@/app/(comic)/_functions/parse-content"
// UI
import Icon from "@/styles/icons"
import Notice from "@/components/notices"
import { Textarea } from "@/components/textarea"
import { AuthLink } from "@/components/auth"
import { useChangeStatus } from "@/components/status-message"
import { ComicErrorMessage, ComicInputRadio, ComicInputSection, ComicInputSectionRow } from "./comic-page-inputs"
import { Field, Fieldset, Label, Legend, RadioGroup } from "@headlessui/react"
import { ComicButton } from "@/components/button"
import { deleteUserPlotSuggestion, submitUserPlotSuggestion, voteOnPlotSuggestion } from "@/app/(comic)/_actions/plot-suggestions"


/**----------------------------------- */
export function ClientComicPageFeedback({
	page,
	session,
	suggestions,
	userVariables,
	variables
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	session?: Awaited<ReturnType<typeof verifySession>>
	suggestions?: Awaited<ReturnType<typeof getComicPageSuggestions>>
	userVariables?: Record<string, string>
	variables: Awaited<ReturnType<typeof getComicVariables>>
}) {
	// HOOKS
	const t = useTranslations()
	const router = useRouter()
	const setStatus = useChangeStatus("")

	// BOOLEANS
	const varsExist = doVarsExist(page.comic_panels)
	const varsSubmitted = haveVarsBeenSubmitted(page.comic_panels)
	const hasPlotSuggestions = checkHasPlotSuggestions(suggestions)
	const allowUserSuggestions = !!page.allow_user_suggestions

	// REFS
	const radioGroupRef = useRef<HTMLDivElement | null>(null)
	const radioItemsRef = useRef<(HTMLSpanElement | null)[]>([])
	const textareaRef = useRef<HTMLTextAreaElement | null>(null)
	const voteTimer = useRef<NodeJS.Timeout | null>(null)

	/**----------------------------------- */
	// SUGGESTIONS: INITIAL DATA

	// Get the ID of the currently logged-in user, if exists
	const loggedInUserID = session?.id || null
	// Check if the User ID exists in current suggestions, and get the ID
	const userVotedOn = suggestions?.find(
		s => s.users_voted!.some(
			(v: any) => v.id === loggedInUserID
		)
	)
	// Check if the user has submitted anything yet
	const userSubmission = suggestions!.find(
		s => s.user_created.id === loggedInUserID
	)
	// Votes
	const loadedVotes = suggestions?.map((s, index) => {
		return s?.users_voted?.length
	})

	// Set up the Vote Variables we will need to create conditionals
	let getOldVoteIndex = suggestions?.findIndex(
		s => s.users_voted!.some(
			(v: any) => v.id === loggedInUserID
		)
	)

	// SUGGESTIONS STATE & HANDLERS
	let [selected, setSelected] = useState<string | "custom" | null>(userVotedOn?.id.toString() || null)
	let [suggestionsList, setSuggestionsList] = useState<
		Awaited<ReturnType<typeof getComicPageSuggestions>> | undefined
	>(suggestions)
	let [userHasSubmitted, setUserHasSubmitted] = useState(!!userSubmission)
	let [voteNums, setVoteNums] = useState(loadedVotes)
	let [oldVoteIndex, setOldVoteIndex] = useState(getOldVoteIndex)


	// HANDLER: Suggestion Radio Item
	const handleRadioClick = (selected: string | "custom" | null) => {
		setSelected(selected)
		// We can't really do anything if the suggestionsList doesn't exist & user is not logged in
		if (suggestionsList && session) {
			let newSuggestionsList = [...suggestionsList]

			// Make sure the index exists, but that also a value of 0 is still true
			let newVoteIndex: number | undefined = selected
				&& suggestionsList.findIndex(s => s.id === parseInt(selected)) !== null
				? suggestionsList.findIndex(s => s.id === parseInt(selected))
				: 0

			// ************************************************
			// --- SELECT CUSTOM SUGGESTION
			// If the "create your own suggestion" radio button is selected
			if (selected == "custom") {
				// Check if the old vote actually exists
				if (oldVoteIndex !== undefined && oldVoteIndex !== -1) {
					// --- REMOVE OLD VOTE -----------------------
					// Get the old list of users who have voted
					let old_users_voted = newSuggestionsList[oldVoteIndex].users_voted
					// 		// Filter out the current user
					let updated_users_voted = old_users_voted?.filter((o) => {
						return o.id !== loggedInUserID
					})
					// Push the new users_voted list to the old vote on the mutable array
					newSuggestionsList[oldVoteIndex].users_voted = updated_users_voted || []

					// --- eo REMOVE OLD VOTE -----------------------

					// Update votenums (-1 from old vote)
					setVoteNums(newSuggestionsList.map((s) => s?.users_voted?.length))
					setSuggestionsList(newSuggestionsList)
					setOldVoteIndex(undefined)
				}
				// ACTION: Submit custom submission to CMS
				voteOnPlotSuggestion({ vote: "custom", page: page, user: session || null })
			}
			// ************************************************
			// --- SELECT REGULAR SUGGESTION
			else if (selected && !isNaN(parseInt(selected))) {
				// --- OLD VOTE + NEW VOTE -------------------
				// If an old vote actually exists + new vote 
				if (
					oldVoteIndex !== undefined && oldVoteIndex !== -1
					&& newVoteIndex !== undefined && newVoteIndex !== -1
				) {
					// --- REMOVE OLD VOTE -----------------------
					// Get the old list of users who have voted
					let old_users_voted = newSuggestionsList[oldVoteIndex].users_voted
					// 		// Filter out the current user
					let updated_users_voted = old_users_voted?.filter((o) =>
						o.id !== loggedInUserID
					)
					// Push the new users_voted list to the old vote on the mutable array
					newSuggestionsList[oldVoteIndex].users_voted = updated_users_voted || []
					// --- eo REMOVE OLD VOTE -----------------------

					// --- ADD NEW VOTE -----------------------
					// Push the new users_voted list to the new vote on the mutable array
					newSuggestionsList[newVoteIndex].users_voted?.push({
						id: session.id,
						email: session.email!,
						username: session.username,
						avatar: session.avatar,
						homepage_url: session.homepage_url,
						name: session.name,
					} as any)
					// --- eo ADD NEW VOTE -----------------------

					// Update votenums (-1 from old vote, +1 to new vote)
					setVoteNums(newSuggestionsList.map((s) => s?.users_voted?.length))
					setSuggestionsList(newSuggestionsList)
					setOldVoteIndex(newVoteIndex)
				}
				// --- NEW VOTE ONLY --------------
				else {
					// --- ADD NEW VOTE -----------------------
					// Push the new users_voted list to the new vote on the mutable array
					newSuggestionsList[newVoteIndex].users_voted?.push({
						id: session.id,
						email: session.email!,
						username: session.username,
						avatar: session.avatar,
						homepage_url: session.homepage_url,
						name: session.name,
					} as any)
					// TODO: ANY
					// --- eo ADD NEW VOTE -----------------------

					// Update votenums ( +1 to new vote)
					setVoteNums(newSuggestionsList.map((s) => s?.users_voted?.length))
					setSuggestionsList(newSuggestionsList)
					setOldVoteIndex(newVoteIndex)
				}

				// Only submit to CMS after a one-second delay where no more input is accepted
				radioItemsRef.current?.forEach((v) => v?.removeAttribute("data-loading")) // remove all  old loading icons
				radioItemsRef.current[parseInt(selected)]?.setAttribute("data-loading", "true") // add to the current one
				voteTimer.current && clearTimeout(voteTimer.current)
				voteTimer.current = setTimeout(() => {
					radioItemsRef.current[parseInt(selected)]?.removeAttribute("data-loading")
					// ACTION: Submit votes update to CMS
					voteOnPlotSuggestion({ vote: selected, page: page, user: session || null })
				}, 1000)
			}
		}
	}

	// HANDLER: Delete Suggestion Button
	const handleDeleteSuggestionClick = (id: number) => {
		// Delete suggestion from state
		if (suggestionsList) {
			// Get the index of the suggestion to delete
			const toDeleteSuggestionIndex = suggestionsList.findIndex(
				s => s.id === id
			)
			// Delete the suggestion from the suggestions list
			setSuggestionsList(
				suggestionsList.toSpliced(toDeleteSuggestionIndex, 1)
			)
			// Delete suggestion from the CMS
			deleteUserPlotSuggestion(id)
			// Notification
			setStatus("success", t("ComicPage.suggestion-deleted"))
			// Cleanup
			setUserHasSubmitted(false)
			setOldVoteIndex(undefined)
		}
	}

	/**----------------------------------- */
	// USER SUGGESTION FORM
	// Input Length Check
	const [inputLength, setInputLength] = useState(0)

	// Validation
	const [lastResult, action] = useActionState(submitUserPlotSuggestion, undefined)
	const [form, fields] = useForm({
		// Sync the result with the last submission
		lastResult,
		// Reuse the validation logic on the client
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: userSuggestionSchema() })
		},
		// Validate the form on blur event triggered
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})

	// EFFECT: Run after the form has successfully submitted
	useEffect(() => {
		if (lastResult?.status == "success") {
			// Notification
			setStatus("success", t("ComicPage.suggestion-submitted"))
			// Add the latest suggestion to the suggestionList state (this should update what the reader sees)
			if (lastResult.data && suggestionsList) {

				let newSuggestionsList = [
					// The original suggestionList is an object we have to turn into an array with `Object.values`
					...Object.values((suggestionsList)),
					// Then we append the response data from submitting the item to directus
					lastResult.data
				]
				// Update the UI state 
				setSuggestionsList(newSuggestionsList)
				setVoteNums(newSuggestionsList.map((s) => s?.users_voted?.length))
				setSelected(lastResult.data.id.toString())
				setUserHasSubmitted(true)
			}
		}
	}, [lastResult])

	/**----------------------------------- */
	// Only render if there are plot suggestions and any page variables have been submitted already
	return hasPlotSuggestions && varsSubmitted && <>
		{/* SECTION: Reader Notices */}
		<ComicInputSection>
			{/* NOTICE: Reader has reached the latest update */}
			<Notice type="alert" title={t("ComicPage.reached-latest-update")}>
				{t.rich("ComicPage.rich-explain-suggestion-voting", {
					p: (chunks) => <p>{chunks}</p>
				})}
			</Notice>
			{/* NOTICE: Reader is not logged in */}
			{!session &&
				<Notice type="error" title={t("status-messages.not-logged-in")}>
					{t.rich("ComicPage.rich-please-login-to-vote", {
						loginLink: (chunks) =>
							<AuthLink className="underline font-bold" isModal={true} modal="login">
								{chunks}
							</AuthLink>
					})}
				</Notice>
			}
		</ComicInputSection>

		{/* SECTION: Plot Suggestions/Feedback */}
		{(varsExist && varsSubmitted || !varsExist) && page.plot_prompt &&
			<ComicInputSection>
				<ComicInputSectionRow>
					<Fieldset disabled={!session}>
						{/* HEADER TEXT: Authour Prompt */}
						<Legend as="legend"
							className={clsx(
								"pb-4",
								"text-lg",
								"text-center",
								"font-comic-header",
								"font-semibold",
							)}>
							{replaceComicVariables({
								content: sanitize(page.plot_prompt),
								variables: variables,
								userVariables: userVariables
							})}
						</Legend>
						{/* RADIO GROUP: Plot Suggestions */}
						<RadioGroup name="suggestions"
							ref={radioGroupRef}
							className={clsx("flex", "flex-col", "gap-y-2",)}
							value={selected}
							onChange={(selected) => handleRadioClick(selected)}
						>
							{/* RADIO BUTTONS: Author Suggestions */}
							{suggestionsList?.map((s, index) =>
								<ComicInputRadio key={index} value={`${s.id}`}
									ref={(element: HTMLSpanElement | null) => {
										radioItemsRef.current[s.id] = element
									}}>
									<Label className={clsx("grow", "text-left")}>
										{/* USER-SUBMITTED METADATA */}

										{page.user_created.id !== s.user_created.id &&
											<div
												className={clsx(
													"flex",
													"text-sm",
													"mt-1",
													"cursor-auto",
													"gap-x-4",
												)}>
												<em className={clsx("text-neutral-400", "dark:text-white/70",)}>
													@{s.user_created.username} says:
												</em>

												{session && s.user_created.id == session.id &&
													<span
														className={clsx(
															"absolute",
															"-top-1",
															"-right-1",
															"flex",
															"ml-auto",
															"gap-x-1",
														)}>
														{/* <button
															title={t("edit-suggestion")}
															className={clsx(
																"px-1",
																"bg-neutral-400",
																"text-white",
																"rounded-sm",
																"cursor-pointer",
															)}>
															<Icon name="penToSquare" className={clsx(
																"size-4",
															)} />
														</button> */}
														<button
															title={t("ComicPage.delete-suggestion")}
															className={clsx(
																"p-1",
																"bg-red-400",
																"text-white",
																"rounded-sm",
																"cursor-pointer",
															)}
															onClick={(e) => {
																e.preventDefault()
																handleDeleteSuggestionClick(s.id)
															}}
														>
															<Icon name="xmark" className={clsx("size-4",)} />
														</button>
													</span>
												}
											</div>
										}
										{/* TITLE */}
										<div className={clsx("cursor-auto")}>
											{replaceComicVariables({
												content: sanitize(s.title),
												variables: variables,
												userVariables: userVariables
											})}
										</div>
									</Label>
									{/* VOTE COUNT */}
									<div className={
										clsx(
											"px-2",
											"self-stretch",
											"content-center",
											"bg-neutral-100",
											"rounded",
											"text-base",
											"font-platform-mono",
											"dark:bg-neutral-900/40",
											"min-w-12",
										)
									}>
										{/* {s.users_voted?.length || 0} */}
										{voteNums ? voteNums[index] : 0}
									</div>
								</ComicInputRadio>
							)}

							{/* RADIO BUTTON: Custom User Suggestion */}
							{allowUserSuggestions && !userHasSubmitted &&
								<ComicInputRadio value="custom" className={clsx("text-left", "mx-auto")}>
									<Label className={clsx("grow", "font-comic-copy")}>
										{t("ComicPage.submit-own-suggestion")}
										{allowUserSuggestions && selected == "custom" && session &&
											// FORM: Custom User Suggestion Form
											<Form className={clsx("mt-2", "animate-fade-in",)}
												id={form.id}
												onSubmit={form.onSubmit}
												action={action}
												onAnimationEnd={() => textareaRef.current?.focus()}
												noValidate
											>
												<Field className={clsx("relative")}>
													{/* Length Checker */}
													<span className={clsx(
														"absolute",
														"-top-6.5",
														"right-0",
														"ml-auto",
														"font-comic-header",
														"font-normal",
														"text-xs",
														"text-current/50"
													)}>
														{`${inputLength}/140`}{/* TODO: should this be hardcoded? */}
													</span>
													<Textarea ref={textareaRef}
														className={clsx("outline-none!",)}
														// Something inside headless.ui's RadioGroup thing is causing spacebar input to not be accepted
														// [Source]](https://github.com/tailwindlabs/headlessui/discussions/1798)
														onKeyDown={
															(e) => (e.key == " " || e.code == "Space" || e.keyCode == 32) && e.stopPropagation()
														}
														onChange={(e) => {
															setInputLength(e.target.value.length)
														}}
														maxLength={140} // TODO: hardcoded
														id={fields.userSuggestion.name}
														name={fields.userSuggestion.name}
														key={fields.userSuggestion.key}
													/>
													<ComicErrorMessage className={clsx("mb-2", "text-center")}>
														{fields.userSuggestion.errors}
													</ComicErrorMessage>
													<ComicButton as="button" type="submit">
														{t("ComicPage.submit-suggestion")}
													</ComicButton>
													<input
														name={fields.pageId.name}
														key={fields.pageId.key}
														type="hidden"
														value={page.id.toString()}
													/>
													<input
														name={fields.slug.name}
														key={fields.slug.key}
														type="hidden"
														value={`p=${page.id}&u=${session.id}`}
													/>
													<input
														name={fields.userId.name}
														key={fields.userId.key}
														type="hidden"
														value={session.id}
													/>
												</Field>
											</Form>
										}
									</Label>
									<Icon name="penToSquare" className={clsx("size-5", "mr-3.5", "group-data-checked:hidden")} />
								</ComicInputRadio>
							}

						</RadioGroup>
					</Fieldset>
				</ComicInputSectionRow>
			</ComicInputSection >
		}
	</>
}