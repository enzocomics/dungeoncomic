"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { ComponentPropsWithRef, useActionState, useEffect, useRef, useState } from "react"
import Form from "next/form"
import { useRouter } from "next/navigation"
import { sanitize } from "@/lib/sanitize"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA

import { replaceComicVariables } from "@/app/(comic)/_functions/parse-content"
// ACTIONS

import { deleteUserPlotSuggestion, PlotSuggestionType, submitUserPlotSuggestion, voteOnPlotSuggestion } from "@/app/(comic)/_actions/plot-suggestions"
// UI
import { Field, Fieldset, Label, Legend, RadioGroup } from "@headlessui/react"
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import Icon from "@/styles/icons"
import { Textarea } from "@/components/textarea"
import { ComicButton } from "@/components/button"
import { AuthLink } from "@/components/auth"
import { verifySession } from "@/data/session"
import { getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { ComicErrorMessage, ComicInputSection, ComicInputSectionRow, ComicInputRadio } from "./comic-page-inputs"
import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
import Notice from "@/components/notices"
import { checkHasPlotSuggestions } from "@/app/(comic)/_functions/check-pages"


export function ClientComicPageFeedback({
	page,
	variables,
	userVariables,
	session
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	session?: Awaited<ReturnType<typeof verifySession>>
}) {
	const router = useRouter()
	const t = useTranslations()
	const setStatus = useChangeStatus("")
	const varsExist = doVarsExist(page.comic_panels)
	const varsSubmitted = haveVarsBeenSubmitted(page.comic_panels)

	const hasPlotSuggestions = checkHasPlotSuggestions(page.plot_suggestions)
	// Get the ID of the currently logged-in user, if exists
	const loggedInUserID = session?.id || null

	/**----------------------------------- */
	// SUGGESTIONS

	// Check if the User ID exists in current suggestions, and get the ID
	const userVotedOn = page.plot_suggestions!.find(
		s => s.users_voted!.some(
			(v: any) => v.id === loggedInUserID
		)
	)

	let getUserVotedOnIndex = page.plot_suggestions!.findIndex(
		(s, index) => s.users_voted!.some(
			(v: any) => v.id === loggedInUserID
		)
	)

	// State of the previous suggestion the current user voted on
	const [userVotedOnID, setUserVotedOnID] = useState(userVotedOn?.id.toString())
	const [userVotedOnIndex, setUserVotedOnIndex] = useState(getUserVotedOnIndex)

	// State for the Plot Suggestion Poll
	// Default value: the ID of the suggestion the logged-in user has already voted on
	const [selected, setSelected] = useState<string>(
		userVotedOnID ? userVotedOnID : ""
	)
	const [selectedObject, setSelectedObject] = useState<PlotSuggestionType>()
	// State of the poll: to prevent the effect from firing multiple times
	const [clicked, setClicked] = useState(false)

	const voteTimer = useRef<NodeJS.Timeout | null>(null)

	// Poll Click Handler
	function handleClick(selectedId: string) {
		setSelected(selectedId)
	}

	// Value of radio button that opens up the user suggestion form
	const selectUserSuggestion = "0"

	// This effect runs every time the poll's radio button selection is changed
	useEffect(() => {
		// Send the vote to the CMS
		const castVote = async (s?: PlotSuggestionType) => {
			const response = voteOnPlotSuggestion({
				// newVoteID: parseInt(plotSuggestionsID),
				vote: s,
				page: page,
				user: session || null
			})
		}

		let timeout = false

		// Cast the vote
		if (clicked == true) {

			votesRef.current[selectedIndex]?.setAttribute("data-loading", "true")
			// Only submit to CMS after a one-second delay where no more input is accepted
			voteTimer.current && clearTimeout(voteTimer.current)
			voteTimer.current = setTimeout(() => {
				castVote(selectedObject) // Send the vote to the cms only
				votesRef.current[selectedIndex]?.removeAttribute("data-loading")
			}, 1000)

			setUserVotedOnID(selected) // Save the suggestion this user voted on for reference
			setClicked(false)
		}
	}, [selected])

	// Now we have to update the numbers on the fly

	// Votes
	const loadedVotes = page.plot_suggestions?.map((s, index) => {
		return s?.users_voted?.length
	})
	const [votes, setVote] = useState(loadedVotes)
	const [selectedIndex, setSelectedIndex] = useState<number>(userVotedOnIndex)

	const votesRef = useRef<(HTMLSpanElement | null)[]>([])


	// When a new thing is voted on:
	// - Get the array INDEX of the item being voted on
	// - Access the value of the VOTES array, at the same INDEX
	// - Modify value
	// - Save as a new array
	// console.log("userVotedOnID: ", userVotedOnID)

	const [scoreChanged, setScoreChanged] = useState<boolean | "custom">(false)

	useEffect(() => {
		if (votes && scoreChanged == "custom") {
			votesRef.current[userVotedOnIndex]?.removeAttribute("data-loading")
			// If we're voting on a user suggestion, only remove any old vote
			let tempArray = [...votes]
			tempArray[userVotedOnIndex] = votes[userVotedOnIndex]! - 1
			setVote(tempArray)
			setUserVotedOnIndex(-1)
			setSelectedIndex(-1)
			setScoreChanged(false)
		}
		if (votes && scoreChanged == true) {
			votesRef.current[userVotedOnIndex]?.removeAttribute("data-loading")
			// console.log("userVotedOnId (old vote): ", userVotedOnID)
			// console.log("userVotedOnIndex (old vote index): ", userVotedOnIndex)
			// console.log("selected (new vote): ", selected)
			// console.log("selectedIndex (new vote index): ", selectedIndex)

			let tempArray = [...votes]

			// if you click on a poll choice
			// - the votenum of the OLD vote should go down 1
			//    - in the array, go to the index of the OLD VOTE and -1
			tempArray[userVotedOnIndex] = votes[userVotedOnIndex]! - 1
			// - the votenum of the NEW vote should go up 1
			tempArray[selectedIndex] = votes[selectedIndex]! + 1

			setVote(tempArray)

			// ------------------------------
			// update the old vote indexes
			setUserVotedOnIndex(selectedIndex)
			setSelectedIndex(selectedIndex)
			setScoreChanged(false)
			// ------------------------------

		}
	}, [selected])

	// Handle State of the vote numbers
	// const [votes, setVote] = useState(s?.users_voted?.length || 0)

	// useEffect(() => {
	// 	// Update the vote numbers on-the-fly
	// 	if (clicked == true) {
	// 		// +1 to the vote that is selected
	// 		if (selected == `${s.id}`)
	// 			setVote(votes + 1)
	// 		// -1 to the vote the user previously voted on
	// 	  if (userVotedOnID == `${s.id}`)
	// 			setVote(votes - 1)
	// 		
	// 	}
	// }, [selected])




	/**----------------------------------- */
	// SUBMITTED SUGGESTIONS

	// Check if the user has submitted anything yet
	const userSubmission = page.plot_suggestions!.find(
		s => s.user_created.id === loggedInUserID
	)

	// Don't allow submissions if they have already submitted one (also if they're the author, they can just edit it in the dashboard)
	const [userHasSubmitted, setUserHasSubmitted] = useState(userSubmission ? true : false)

	// DEBUG: uncomment me
	// const [userHasSubmitted, setUserHasSubmitted] = useState(false)

	const [deleteSuggestion, setDeleteSuggestion] = useState<number | null>(null)

	// User Suggestion Textarea Ref
	const suggestionRef = useRef<HTMLTextAreaElement | null>(null)


	/**----------------------------------- */
	// POLL VOTE HANDLER



	/**----------------------------------- */
	// Render
	return hasPlotSuggestions && varsSubmitted ? <>
		{
			/**------------------------------
			 * FEEDBACK
			 * -
			 */
		}
		<ComicInputSection>
			<Notice
				type="alert"
				title={t("ComicPage.reached-latest-update")}
			>
				{t.rich("ComicPage.rich-explain-suggestion-voting", {
					p: (chunks) => <p>{chunks}</p>
				})}
			</Notice>
			{!session &&
				<Notice
					type="error"
					title={t("status-messages.not-logged-in")}
				>
					{
						t.rich("ComicPage.rich-please-login-to-vote", {
							loginLink: (chunks) => <AuthLink className={clsx("underline font-bold")} isModal={true} modal="login">{chunks}</AuthLink>
						})
					}
				</Notice>
			}

		</ComicInputSection >
		{(varsExist && varsSubmitted || !varsExist) && page.plot_prompt &&
			<ComicInputSection className={
				clsx(
					// firstLoad && "animate-fade-in",
				)
			}>
				<ComicInputSectionRow>
					<Fieldset
						disabled={session ? false : true}>
						<Legend as="legend" className={
							clsx(
								"pb-4",
								"text-lg",
								"text-center",
								"font-comic-header",
								"font-semibold",
							)
						}>
							{replaceComicVariables({
								content: sanitize(page.plot_prompt),
								variables: variables,
								userVariables: userVariables
							})}
						</Legend>
						<RadioGroup
							name="suggestions"
							value={selected}
							onChange={(selected) => handleClick(selected)}
							className={clsx(
								"flex",
								"flex-col",
								"gap-y-2",
							)}>
							{/* PLOT SUGGESTIONS */}
							{page.plot_suggestions ? page.plot_suggestions.map((s, index) => {

								// RENDER
								if (deleteSuggestion !== s.id)
									return <ComicInputRadio
										ref={(element: HTMLSpanElement | null) => {
											votesRef.current[index] = element
										}}
										value={`${s.id}`}
										key={index}
										onClick={() => {
											setSelectedObject(s)
											setSelectedIndex(index)
											setClicked(true)
											setScoreChanged(true)
										}}
									>
										<Label className={
											clsx(
												"grow",
												"text-left",
											)
										}
										>
											{/* SEPARATE AUTHOR SUGGESTIONS FROM USER SUGGESTIONS */}
											{page.user_created.id !== s.user_created.id &&
												<div className={clsx(

													"flex",
													"text-sm",
													"mt-1",
													"cursor-auto",
													"gap-x-4",
												)}>
													<em className={clsx(
														"text-neutral-400",
														"dark:text-white/70",
													)}>
														@{s.user_created.username} says:
													</em>

													{session && s.user_created.id == session.id &&
														<span className={clsx(
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
																onClick={async () => {
																	deleteUserPlotSuggestion(s.id)
																	setDeleteSuggestion(s.id)
																	setUserHasSubmitted(false)
																	setStatus("success", t("ComicPage.suggestion-deleted"))
																	router.refresh()
																}}
															>
																<Icon name="xmark" className={clsx(
																	"size-4",
																)} />
															</button>
														</span>
													}
												</div>
											}

											<div className={clsx(
												"cursor-auto"
											)}>
												{replaceComicVariables({
													content: sanitize(s.title),
													variables: variables,
													userVariables: userVariables
												})}
											</div>

										</Label>
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
											{votes ? votes[index] : 0}
										</div>
									</ComicInputRadio>
							}) : null}
							{/* 
								SUBMIT OWN SUGGESTION
								- Only display this radio button if the user hasn't already submitted something
								- When it's selected, display the suggestion form
						*/}
							{page.allow_user_suggestions &&
								!userHasSubmitted &&
								<ComicInputRadio
									value={selectUserSuggestion}
									onClick={() => {
										setSelected("")
										setClicked(true)
										setSelectedObject(undefined)
										setScoreChanged("custom")
									}}
									className={clsx(
										"text-left",
										"mx-auto",
									)}>
									{/* <Radio value={selectUserSuggestion} /> */}
									<Label className={
										clsx(
											"grow",
											"font-comic-copy",
										)
									}>
										{t("ComicPage.submit-own-suggestion")}
										{page.allow_user_suggestions && selected == selectUserSuggestion &&
											<UserSuggestionForm ref={suggestionRef} />
										}
									</Label>
									<Icon name="penToSquare" className={
										clsx(
											"size-5",
											"mr-3.5",
											"group-data-checked:hidden"
										)
									} />
								</ComicInputRadio>
							}
						</RadioGroup>

					</Fieldset>

					<StatusMessage className={
						clsx(
							"mt-2"
						)
					} />
				</ComicInputSectionRow>
			</ComicInputSection>
		}
	</> : null

	/**----------------------------------- */

	function UserSuggestionForm(props: ComponentPropsWithRef<"textarea">) {
		// VALIDATION
		const [lastResult, action] = useActionState(submitUserPlotSuggestion, undefined)
		const [form, fields] = useForm({
			// Sync the result with the last su8bmission
			lastResult,

			// Reuse the validation logic on the client
			onValidate({ formData }) {
				return parseWithZod(formData, { schema: userSuggestionSchema() })
			},

			// Validate the form on blur event triggered
			shouldValidate: "onBlur",
			shouldRevalidate: "onInput",
		})

		// EFFECT: on submit
		useEffect(() => {
			if (lastResult?.status == "success") {
				setSelected("")
				setUserHasSubmitted(true)
				setStatus("success", t("ComicPage.suggestion-submitted"))
				router.refresh()
			}
		}, [lastResult])

		// props.ref ? props.ref.current?.focus() : null

		// Textarea length checker
		const [inputLength, setInputLength] = useState(0)

		// Render
		return <>
			{session &&
				<Form className={
					clsx(
						"mt-2",
						"animate-fade-in"
					)
				}
					id={form.id}
					onSubmit={form.onSubmit}
					action={action}
					noValidate
					onAnimationEnd={() => suggestionRef.current?.focus()}
				>
					<Field className={clsx(
						"relative",
					)}>
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
						<Textarea ref={props.ref} className={
							clsx(
								"outline-none!",
							)
						}
							id={fields.userSuggestion.name}
							name={fields.userSuggestion.name}
							key={fields.userSuggestion.key}
							onChange={(e) => {
								setInputLength(e.target.value.length)
							}}
							// Something inside headless.ui's RadioGroup thing is causing spacebar input to not be accepted
							// [Source]](https://github.com/tailwindlabs/headlessui/discussions/1798)
							onKeyDown={
								(e) => (e.key == " " || e.code == "Space" || e.keyCode == 32) && e.stopPropagation()
							}
							maxLength={140} // TODO: should this be hardcoded?
						/>
						<ComicErrorMessage className={clsx(
							"mb-2",
							"text-center",
						)}>
							{fields.userSuggestion.errors}
						</ComicErrorMessage>

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
					<ComicButton as="button" type="submit">{t("ComicPage.submit-suggestion")}</ComicButton>
				</Form>
			}
		</>
	} // EO UserSuggestionForm()
	/**----------------------------------- */
}