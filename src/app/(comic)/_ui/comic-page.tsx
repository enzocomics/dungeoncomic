"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// DATA
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { saveUserVarsCookie } from "../_actions/cookies"
import replaceComicVariables from "../_functions/replace-comic-vars"
// UI
import { useChangeStatus } from "@/components/status-message"
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/components/dropdown"
import { Radio, RadioField, RadioGroup } from "@/components/radio"
import { Field, Fieldset, Label, Legend } from "@/components/fieldset"
import { Link } from "@/components/link"
import { Textarea } from "@/components/textarea"
import { Button } from "@/components/button"
import { VoteOnPlotSuggestion } from "../_actions/plot-suggestions"

/**----------------------------------- */
// TYPES
type ComicPageUIProps = {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	session?: Awaited<ReturnType<typeof verifySession>>
}

/**-----------------------------------
 * Comic Landing Page UI
 * ---
 */
export function ComicLandingPageUI({
	comic
}: {
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-yellow-500",
		)}>
			This is the Comic Landing Page
		</div>
	</>
}
/**-----------------------------------
 * Comic Page UI
 * ---
 */

export default function ComicPageUI({
	page,
	variables,
	userVariables,
	session
}: ComicPageUIProps) {
	// VARIABLES
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	/**----------------------------------- */
	// Get a list of all the comic panel variables
	// Check if they all exist in the url search params
	// IF they do, then change the UI to the "submitted" version

	// Check if any variables have been defined in the comic project
	const varsExist = page.comic_panels ? (page.comic_panels.flatMap(p => p.variables && p.variables.length > 0)).some(Boolean) : false

	// Get a flat map of all the variables for this specific page's comic panels
	const varParams = page.comic_panels ? page.comic_panels.flatMap(p =>
		p.variables && p.variables.length > 0 ?
			p.variables.map(v => v.slug) : []
	) : null

	// Check the url search params if _every_ variable has been submitted 
	const varsSubmitted = varParams && varParams.length > 0 ? varParams.every((param) => param ? searchParams.has(param) : false) : false

	// Get a list of all the variables the reader has submitted to this page
	const submittedUserVars: Record<string, string | null> = varParams ? Object.fromEntries(
		varParams.map((key) => [key, searchParams.get(key)])
	) : {}


	/**----------------------------------- */
	// State that checks if we can go backwards, to the same site, using browser history 
	const [canGoBack, setCanGoBack] = useState(false)
	// Run every time client navigates (url change or searchparams change)
	useEffect(() => {
		// Check if variables have been submitted to this page and save them to cookie
		const saveUserVariables = async () => {
			// Save Variables if they have been submitted
			if (varsSubmitted)
				await saveUserVarsCookie({
					vars: submittedUserVars,
					page: page
				})
		}

		// Check if browser history exists
		const hasHistory = window.history.length > 1
		let previousPageIsSameSite = false

		// DEBUG
		// console.log("document.referrer:", document.referrer || "none")
		// If we came from another page
		// NOTE: THIS DOES NOT WORK IN PRIVATE BROWSERS
		if (document.referrer)
			try {
				// Check if the other page is from the same host
				const previousUrl = new URL(document.referrer)
				previousPageIsSameSite = previousUrl.hostname === window.location.hostname

				// DEBUG
				// console.log("previousUrl.hostname:", previousUrl.hostname)
				// console.log("window.location.hostname:", window.location.hostname)
				// console.log("is the previous page from the same site:", previousPageIsSameSite)
			}
			catch {
				previousPageIsSameSite = false
			}

		// INIT
		saveUserVariables()
		setCanGoBack(hasHistory && previousPageIsSameSite)
	}, [pathname, searchParams.toString()])


	/**----------------------------------- */
	// HELPER FUNCTIONS
	function getComicPageVars(
		comic_panels:
			typeof page.comic_panels
	) {
		return comic_panels ? comic_panels.flatMap(p =>
			p.variables && p.variables.length > 0 ?
				p.variables : []
		) : null
	}

	function makeComicVarsUrl({
		comicVars,
		userVars
	}: {
		comicVars: any // TODO: typed as any, please fix
		userVars?: Record<string, string | null>
	}) {
		// Build a URLSearchParams object that handles all the syntax/concatenation automatically
		const params = new URLSearchParams(
			comicVars.map(({ slug, default_value }: { slug: string, default_value: string }) => [
				slug,
				// Fallback to default value if undefined
				userVars && userVars[slug] !== undefined ? userVars[slug] : default_value
			])
		)

		// Return it as a string
		return params.size == 0 ? `` : `?${params.toString()}`
	}

	/**----------------------------------- */
	// Render
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-pink-300",
			"flex",
			"flex-col",
			"gap-2",
			"bg-base-1",
			"text-center"
		)}>
			<h4 className={clsx(
				"text-3xl",
				"font-semibold",
				"font-display",
				"text-center"
			)}>
				{replaceComicVariables({
					content: (
						varsExist && varsSubmitted ?
							page.variables_submit_button_text || "Next »" : // TODO: hardcoded
							page.title
					),
					variables: variables,
					userVariables: userVariables
				})
				}
			</h4>
			{/* <p>{page.description}</p> */}
			{
				/**------------------------------
				 *	DISPLAY THE COMIC PANELS
				 * ---
				 * - Do not show if variables have been submitted correctly
				 */
			}
			<VariablesForm varsExist={varsExist}>
				{page.comic_panels ? page.comic_panels.map((p, index) => {
					// Conditionally render comic panels before OR after variables are submitted based on page option
					if (
						(!varsSubmitted && !p.place_after_variables_submitted) ||
						(varsSubmitted && p.place_after_variables_submitted)
					)
						// Render
						return <div key={index}>
							{p.panel_image &&
								<p><Image
									className={clsx(
										"mx-auto"
									)}
									src={`${directusURL}/assets/${p.panel_image.filename_disk}.${p.panel_image.type}`}
									width={`${p.panel_image.width}`}
									height={`${p.panel_image.height}`}
									alt={`${p.panel_image.description}`}
									loading="eager"
								/></p>
							}
							{/* <p>{p.panel_title}</p> */}
							<div className={clsx(
								"mt-4",
								"prose"
							)}
								// TODO: You better freakin' sanitize this
								dangerouslySetInnerHTML={{
									__html: replaceComicVariables({
										content: p.panel_description,
										variables: variables,
										userVariables: userVariables,
										html: true
									})
								}}
							>
							</div>
							{/* VARIABLES */}
							{p.variables && p.variables.length > 0 ?
								<section className={clsx(
									"bg-teal-100",
									"dark:bg-teal-700",
									"p-2",
									"w-2/3",
									"mx-auto",
									"mt-8",
								)}>
									<section>
										{p.variables.map((v, index) => {
											return <div key={index}>
												<p className={clsx(
													"text-center"
												)}><label>{v.prompt || v.name}</label></p>
												<p>&gt; <input className={clsx(
													"p-2",
													"bg-white",
													"text-black",
													"w-9/10",
												)} type="text" name={v.slug} defaultValue={
													userVariables && userVariables[v.slug] ? userVariables[v.slug] as string : v.default_value

												} required></input></p>
											</div>
										})}
									</section>
								</section>
								: null}
						</div>
				}) : null}

				{
					/**------------------------------
					 * SUBMIT BUTTON
					 * ---
					 * - Show ONLY if variables exist BUT they haven't been submitted
					 */
				}
				{(varsExist && !varsSubmitted) &&
					<div className={clsx(
						"flex",
						"flex-col",
						"w-2/3",
						"mx-auto",
						"mt-8",
						"gap-2",
						"p-2",
						"bg-amber-100",
						"dark:bg-amber-900",
						"text-xs"
					)}>
						<button className={clsx(
							"block",
							"p-2",
							"hover:bg-black/10",
							"cursor-pointer"
						)}>{`${page.variables_submit_button_text || "Next Page"} »`}</button>
					</div>
				}
			</VariablesForm>

			{(varsExist && varsSubmitted || !varsExist) && page.plot_prompt &&
				<UserFeedbackSection page={page} variables={variables} userVariables={userVariables} session={session} />
			}
			{
				/**------------------------------
				 * NAVIGATION BLOCK
				 * -
				 */
			}
			<section className={clsx(
				"mt-8",
				"flex",
				"flex-col",
				"gap-8",
				"w-full"
			)}>
				{
					/**------------------------------
					 *	NEXT NAVIGATION
					 * ---
					 * - Display IF variables don't exist at all,
					 * - OR if variables exist AND they've been submitted
					 */
				}
				{(!varsExist || (varsExist && varsSubmitted)) &&
					<div className={clsx(
						"mx-auto",
						"w-2/3",
					)}>
						{page.next_pages && page.next_pages.length > 0 &&
							<>
								<ul className={clsx(
									"flex",
									"flex-col",
									"gap-2",
									"p-2",
									"bg-amber-100",
									"dark:bg-amber-900",
									"text-xs"
								)}>
									{page.next_pages.map((n, index) =>
										<li key={index} className={clsx(
										)}>
											<Link className={clsx(
												"block",
												"p-2",
												"hover:bg-black/10",
											)} href={`${n.linked_pages_id.comic_pagenum}`}>
												<strong>{
													replaceComicVariables({
														content: n.linked_pages_id.title,
														variables: variables,
														userVariables: userVariables
													})
												} &raquo;</strong><br />
												{n.linked_pages_id.subtitle &&
													<p>{
														replaceComicVariables({
															content: n.linked_pages_id.subtitle,
															variables: variables,
															userVariables: userVariables
														})
													}</p>
												}
											</Link>
										</li>
									)}
								</ul>
							</>
						}
					</div>
				}

				{
					/**------------------------------
					 * PREV NAVIGATION
					 * - Instead of linking directly to the previous page,
					 *   we are going back 1 step in browser history
					 * - This is because pages can have multiple `prev_pages`
					 */
				}
				<div className={clsx(
					"basis-full",
				)}>
					{
						(page.prev_pages && page.prev_pages.length > 0 || varsSubmitted) &&
						<>
							<div className={clsx(
								"p-2",
								"bg-orange-100",
								"dark:bg-orange-900",
								"text-xs"
							)}>
								<ul className={clsx(
									"flex",
									"flex-col",
									"gap-2",
								)}>
									{/* 
										Back button: Go back 1 step in user's browser history
										- IF previous page in browser history is from the same host
									*/}
									{canGoBack &&
										<li>
											<button className={clsx(
												"w-full",
												"block",
												"p-2",
												"hover:bg-black/10",
												"cursor-pointer"
											)} onClick={() => router.back()} >
												<span>&laquo; Go Back (History)</span>
											</button>
										</li>
									}
									{/* 
										Back button:
										- If there is no previous page from the same hostname in history, and:
										- If THIS PAGE has submitted variables:
											- GO BACK to the "pre-submitted" version of THIS PAGE
									*/}
									{(!canGoBack && varsSubmitted) &&
										<li>
											<Link className={clsx(
												"block",
												"p-2",
												"hover:bg-black/10",
											)} href={pathname}>&laquo; Go Back (Variable Form Page)</Link>
										</li>
									}
									{/* 
										Back button: 
										- If there is no previous page from the same hostname in history,
										- If there are no variables being submitted on THIS page,
										- If the previous page has variable:
										  - If user variables already exist, rebuild the previous page url with the userVars
											- If user variables do not exist, build the previouspage url with the default vars
									*/}
									{(
										!canGoBack && !varsSubmitted &&
										page.prev_pages && page.prev_pages.length == 1
									) &&
										<li>
											<Link className={clsx(
												"block",
												"p-2",
												"hover:bg-black/10",
											)} href={`${page.prev_pages[0].pages_id.comic_pagenum}` + makeComicVarsUrl({
												comicVars: getComicPageVars(page.prev_pages[0].pages_id.comic_panels as typeof page.comic_panels),
												userVars: userVariables
											})}
											>&laquo; Go Back (Single Previous Page)</Link>

										</li>
									}
									{/* <li>{getComicPageVars(page.prev_pages[0].pages_id.comic_panels as typeof page.comic_panels)}</li> */}
									{/* 
										Display list of previous pages if there's more than one, OR if the user's "previous page" in the browser history is NOT a possible previous page in this comic series
									*/}

									{
										page.prev_pages && page.prev_pages.length > 1 &&
										<Dropdown>
											<DropdownButton outline>
												Go Back (All Choices) &#8595;
											</DropdownButton>
											<DropdownMenu>
												{page.prev_pages.map((n, index) =>
													<DropdownItem key={index} href={
														`${n.pages_id.comic_pagenum}` + makeComicVarsUrl({
															comicVars: getComicPageVars(n.pages_id.comic_panels as typeof page.comic_panels),
															userVars: userVariables
														})
													}>
														{/* <Link className={clsx(
															"block",
															"p-2",
															"hover:bg-black/10",
														)} href={`${n.pages_id.comic_pagenum}`}> */}
														<strong>&laquo; {n.pages_id.variables_submit_button_text || n.pages_id.title}</strong>
														{/* </Link> */}
													</DropdownItem>
												)}
											</DropdownMenu>
										</Dropdown>
									}
									<li>
										<Link className={clsx(
											"block",
											"p-2",
											"hover:bg-black/10",
										)} href="./">&laquo; Go to Start</Link>
									</li>
								</ul>
							</div>
						</>
					}
				</div>

			</section >

			{
				/**------------------------------
				 *	Page Meta
				 */
			}
			<section>
				<h4 className={clsx(
					"font-semibold"
				)}>Page Metadata</h4>
				<ul className={clsx(
					"p-2",
					"bg-amber-100",
					"dark:bg-amber-900",
					"text-xs"
				)}>
					<li><strong>Created by</strong> @{page.user_created.username ? page.user_created.username : ""} on {page.date_created}</li>
					{page.user_updated &&
						<li><strong>Last updated by</strong> @{page.user_updated.username} on {page.date_updated}</li>
					}
				</ul>
			</section >

		</div >

		{page.allow_user_comments &&
			<section className={clsx(
				"mt-8"
			)}>
				<h4 className={clsx(
					"text-xl"
				)}>Comments</h4>
				<div className={clsx(
					"bg-base-1"
				)}>
					Comments here
				</div>
			</section>
		}
	</>
}
/**-----------------------------------
 * Conditionally Render the Form depending on if variables exist
 * ---
 */
function VariablesForm({
	varsExist,
	children
}: {
	varsExist: Boolean
	children: React.ReactNode
}) {
	// Render Form tags if vars exist
	if (varsExist)
		return <Form action="">
			{children}
		</Form>
	// Otherwise, render nothing
	else if (!varsExist)
		return children

}


/**-----------------------------------
 * User Feedback Section
 * ---
 */
function UserFeedbackSection({
	page,
	variables,
	userVariables,
	session
}: ComicPageUIProps) {

	// Get the ID of the currently logged-in user, if exists
	const loggedInUserID = session != false ? session?.id : null

	// Check if the User ID exists in current suggestions, and get the ID
	const userVotedOn = page.plot_suggestions!.find(
		s => s.users_voted!.some(
			(v: any) => v.id === loggedInUserID
		)
	)

	const [userVotedOnID, setUserVotedOnID] = useState(userVotedOn?.id.toString())

	// State for the Plot Suggestion Poll
	// Default value: the ID of the suggestion the logged-in user has already voted on
	const [selected, setSelected] = useState<string>(
		userVotedOnID ? userVotedOnID : ""
	)
	// State of the poll: to prevent the effect from firing multiple times
	const [clicked, setClicked] = useState(false)

	// Poll Click Handler
	function handleClick(selectedId: string) {
		setSelected(selectedId)
		setClicked(true)
	}

	// Value of radio button that opens up the user suggestion form
	const selectUserSuggestion = "0"

	// This effect runs every time the poll's radio button selection is changed
	useEffect(() => {
		// Send the vote to the CMS
		const castVote = async (plotSuggestionsID: string) => {
			VoteOnPlotSuggestion({
				newVoteID: parseInt(plotSuggestionsID),
				page: page,
				user: session ? session : false
			})
		}

		// Handle the form
		if (selected == selectUserSuggestion) {
			console.log("handle the form")
		}

		// Cast the vote
		if (clicked == true) {
			castVote(selected) // Send the vote to the cms
			setUserVotedOnID(selected) // Save the suggestion this user voted on for refernece
			setClicked(false)
		}
	}, [selected])

	// Render
	return <>
		{
			/**------------------------------
			 * FEEDBACK
			 * -
			 */
		}
		<section className={clsx(
			"bg-pink-100",
			"dark:bg-pink-800",
			"p-4",
			"mt-8",
		)}>
			{!session &&
				<h4 className={clsx(
					"text-2xl"
				)}>Please <Link href="/login">log in</Link> if you want to vote!</h4>
			}
			<Fieldset
				disabled={session ? false : true}>
				<Legend>{replaceComicVariables({
					content: page.plot_prompt,
					variables: variables,
					userVariables: userVariables
				})}</Legend>
				<RadioGroup
					name="suggestions"
					value={selected}
					onChange={(selected) => handleClick(selected)}
					className={clsx(
					)}>
					{/* PLOT SUGGESTIONS */}
					{page.plot_suggestions ? page.plot_suggestions.map((s, index) => {
						// Handle State of the vote numbers
						const [votes, setVote] = useState(s.votes || 0)

						useEffect(() => {
							// Update the vote numbers on-the-fly
							if (clicked == true) {
								// +1 to the vote that is selected
								if (selected == `${s.id}`)
									setVote(votes + 1)
								// -1 to the vote the user previously voted on
								if (userVotedOnID == `${s.id}`)
									setVote(votes - 1)
							}
						}, [selected])
						// RENDER
						return <RadioField
							key={index}
							className={clsx(
								"text-left",
								"w-2/3",
								"mx-auto"
							)}>
							<Radio value={`${s.id}`} />
							<Label>
								{`${s.id}`} -&nbsp;
								{replaceComicVariables({
									content: s.title,
									variables: variables,
									userVariables: userVariables
								})}
								{/* SEPARATE AUTHOR SUGGESTIONS FROM USER SUGGESTIONS */}
								{page.user_created.id !== s.user_created.id &&
									<em>&nbsp;&mdash; @{s.user_created.username}</em>
								}
								&nbsp;| <strong>{votes}</strong>
							</Label>
						</RadioField>
					}
					) : null}
					{/* 
								SUBMIT OWN SUGGESTION
								- Only display this radio button if the user hasn't already submitted something
								- When it's selected, display the suggestion form
						*/}
					{page.allow_user_suggestions &&
						<RadioField className={clsx(
							"text-left",
							"w-2/3",
							"mx-auto"
						)}>
							<Radio value={selectUserSuggestion} />
							<Label>
								Submit my own suggestion
							</Label>
						</RadioField>
					}
				</RadioGroup>

			</Fieldset>
			{/* 
						SUGGESTION FORM
				*/}
			{session && page.allow_user_suggestions && selected == selectUserSuggestion &&
				<form >
					<Field className={clsx(
						"mt-8"
					)}>
						<Label>User Suggestion Form</Label>
						<Textarea name="user-suggestion" />
						<input name="slug" type="text" disabled value={`p=${page.id}&u=${session.id}`} />
						<input name="userId" type="text" disabled value={session.id} />
					</Field>
					<Button>Submit</Button>
					<input type="hidden" />
				</form>
			}

		</section>

	</>
}