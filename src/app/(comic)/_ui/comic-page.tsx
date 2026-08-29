"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
// UI
import { useChangeStatus } from "@/components/status-message"
import { Link } from "@/components/link"
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "@/components/dropdown"
import { saveUserVarsCookie } from "../_action"
import replaceComicVariables from "../_functions/replace-comic-vars"


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
	userVarsCookie
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVarsCookie?: Record<string, string>
}) {
	const pathname = usePathname()
	const router = useRouter()
	const searchParams = useSearchParams()

	// Get a list of all the comic panel variables
	// Check if they all exist in the url search params
	// IF they do, then change the UI to the "submitted" version

	// Check if any variables have been defined in the comic project
	const varsExist = page.comic_panels ? (page.comic_panels.flatMap(p => p.variables && p.variables.length > 0)).some(Boolean) : false

	// Get a list of all the variables for this specific page's comic panels
	const varParams = page.comic_panels ? page.comic_panels.flatMap(p => p.variables && p.variables.length > 0 ? p.variables.map(v => v.slug) : []
	) : null

	// Check the url search params if _every_ variable has been submitted 
	const varsSubmitted = varParams && varParams.length > 0 ? varParams.every((param) => param ? searchParams.has(param) : false) : false

	// Get a list of all the variables the reader has submitted to this page
	const submittedUserVars: Record<string, string | null> = varParams ? Object.fromEntries(
		varParams.map((key) => [key, searchParams.get(key)])
	) : {}

	// Get the variables that are currently saved in cookies
	const userVariables: Record<string, string> | undefined = userVarsCookie

	// Check if variables have been submitted to this page and save them to cookie
	useEffect(() => {
		const saveUserVariables = async () => {
			// Save Variables if they have been submitted
			if (varsSubmitted)
				await saveUserVarsCookie({
					vars: submittedUserVars,
					page: page
				})
		}
		saveUserVariables()
		// Run every time client navigates (url change or searchparams change)
	}, [pathname, searchParams.toString()])

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
											// console.log(loadedVars[v.slug])
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
			{
				/**------------------------------
				 * FEEDBACK
				 * -
				 */
			}
			{page.plot_prompt &&
				<div className={clsx(
					"bg-pink-100",
					"dark:bg-pink-800",
					"p-4",
					"mt-8",
				)}>
					<h4 className={
						clsx(
							"text-2xl",
							"font-semibold",
							"text-center",
							"mb-2"
						)
					}>
						{page.plot_prompt}
					</h4>
					<ul className={clsx(

					)}>
						{/* AUTHOR SUGGESTIONS */}
						{page.plot_suggestions ? page.plot_suggestions.map((s, index) => (
							<li key={index} className={clsx(
								"text-center"
							)}>
								<strong>{s.votes || 0}</strong> | {s.title} &nbsp;
								{/* SEPARATE AUTHOR SUGGESTIONS FROM USER SUGGESTIONS */}
								{page.user_created.id !== s.user_created.id &&
									<em>&mdash; @{s.user_created.username}</em>
								}
							</li>
						)) : null}
					</ul>
					<div>
						User Suggestion Form Here
					</div>
				</div>
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
										- TODO: Check if previous page in browser history is actually the previous page in the comic
									*/}
									<li>
										<button className={clsx(
											"w-full",
											"block",
											"p-2",
											"hover:bg-black/10",
											"cursor-pointer"
										)} onClick={() => router.back()} >
											<span>&laquo; Go Back</span>
										</button>
									</li>

									{/* 
										Display list of previous pages if there's more than one, OR if the user's "previous page" in the browser history is NOT a possible previous page in this comic series
									*/}

									{page.prev_pages && page.prev_pages.length > 1 &&
										<Dropdown>
											<DropdownButton outline>
												Go Back a different way
											</DropdownButton>
											<DropdownMenu>
												{page.prev_pages.map((n, index) =>
													<DropdownItem key={index} href={`${n.pages_id.comic_pagenum}`}>
														{/* <Link className={clsx(
															"block",
															"p-2",
															"hover:bg-black/10",
														)} href={`${n.pages_id.comic_pagenum}`}> */}
														<strong>&laquo; {n.pages_id.title}</strong>
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

			</section>

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
			</section>

		</div>


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
