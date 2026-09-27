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
import { submitUserPlotSuggestion } from "@/app/(comic)/_actions/plot-suggestions"


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
	const suggestionRef = useRef<HTMLTextAreaElement | null>(null)

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

	// Vote Numbers
	const loadedVotes = suggestions?.map((s, index) => {
		return s?.users_voted?.length
	})

	// SUGGESTIONS STATE & HANDLERS
	type simpleSuggestionType = {

	}

	let [selected, setSelected] = useState<number | "custom" | null>(null)
	let [suggestionsList, setSuggestionsList] = useState<
		Awaited<ReturnType<typeof getComicPageSuggestions>> | undefined
	>(suggestions)

	console.log(suggestions)



	let [votes, setVotes] = useState(loadedVotes)

	const handleRadioClick = (selected: number | "custom" | null) => {
		setSelected(selected)
		// console.log(selected)
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
			// console.log(lastResult.data)
			const s = lastResult.data
			// Deselect the custom radio button
			setSelected(null)
			// Notification
			setStatus("success", t("ComicPage.suggestion-submitted"))
			// Add the latest suggestion to the suggestionList state (this should update what the reader sees)
			suggestionsList && setSuggestionsList([
				...Object.values((suggestionsList)),
				lastResult.data as unknown as any
			])

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
							{suggestionsList?.map((s, index) => {
								return <ComicInputRadio key={index} value={`${s.id}`}>
									<Label className={clsx("grow", "text-left")}>
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
										{votes ? votes[index] : 0}
									</div>
								</ComicInputRadio>
							})}

							{/* RADIO BUTTON: Custom User Suggestion */}
							<ComicInputRadio value="custom" className={clsx("text-left", "mx-auto")}>
								<Label className={clsx("grow", "font-comic-copy")}>
									{t("ComicPage.submit-own-suggestion")}
									{allowUserSuggestions && selected == "custom" && session &&
										// FORM: Custom User Suggestion Form
										<Form className={clsx("mt-2", "animate-fade-in",)}
											id={form.id}
											onSubmit={form.onSubmit}
											action={action}
											// onAnimationEnd={() => suggestionRef.current?.focus()}
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
												<Textarea className={clsx("outline-none!",)}
													// Something inside headless.ui's RadioGroup thing is causing spacebar input to not be accepted
													// [Source]](https://github.com/tailwindlabs/headlessui/discussions/1798)
													onKeyDown={
														(e) => (e.key == " " || e.code == "Space" || e.keyCode == 32) && e.stopPropagation()
													}
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

						</RadioGroup>
					</Fieldset>
				</ComicInputSectionRow>
			</ComicInputSection >
		}
	</>
}