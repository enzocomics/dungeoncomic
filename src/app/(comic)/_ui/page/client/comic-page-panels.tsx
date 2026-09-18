"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, HTMLElementType, Ref, useActionState, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import { detailedDate, relativeDate } from "@/lib/dayjs"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { replaceComicVariables } from "@/app/(comic)/_functions/parse-content"
// ACTIONS
import { saveUserVars } from "@/app/(comic)/_actions/variables"
import { deleteUserPlotSuggestion, PlotSuggestionType, submitUserPlotSuggestion, voteOnPlotSuggestion } from "@/app/(comic)/_actions/plot-suggestions"
// HELPERS

import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
// UI
import * as Headless from "@headlessui/react"
import { Button, Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Field, Fieldset, Label, Legend, Radio, RadioGroup, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useComicContext } from "../../context"
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import { ErrorMessage } from "@/components/forms"
import Link from "next/link"
import Icon from "@/styles/icons"
import { Textarea } from "@/components/textarea"
import { ComicButton } from "@/components/button"
import { AuthLink } from "@/components/auth"
import { ComicPageUIProps } from "../comic"

import { ComicErrorMessage, ComicInputSection, ComicInputSectionRow } from "./comic-page-inputs"


export function ClientComicPanels({
	page,
	variables,
	userVariables,
	panelDescriptions,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	panelDescriptions?: string[]
}) {
	const router = useRouter()
	const t = useTranslations("ComicPage")

	const varsExist = doVarsExist(page.comic_panels)
	const varsSubmitted = haveVarsBeenSubmitted(page.comic_panels)

	// Get this page's variables
	const pageVars = Object.fromEntries(
		(page.comic_panels ?? []) // Iterate through page panels
			.flatMap((p) => p.variables ?? [])
			.filter(Boolean) // Collect only valid variables
			.map((v) => [v.id, v]) // Convert array to an object keyed by `id`
		/* Outputs:
			[
				{ name: "Variable Name", slug: "variable-name", id: 1, etc}
				{ name: "Another Var Name", slug: "another-var-name", id: 2, etc}
			]
		*/
	)

	// VALIDATION SCHEMA
	const schema = z.object({
		userVars: z.object(
			Object.fromEntries(
				Object.keys(pageVars).map(
					(id) => [
						`var${id}`,
						z.string().max(32)
					]
				)
			)
		) /* Outputs:
					{
						1: z.string(),
						2: z.string()
					}
			*/
	})

	// VALIDATION
	const [lastResult, action] = useActionState(saveUserVars, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema })
		},
		onSubmit(e, { formData }) {

			// Make a new search params object
			const params = new URLSearchParams()
			// Iterate through the variables and dynamically get each one based on its id
			Object.values(pageVars).forEach(v => {
				const slug = pageVars[v.id].slug
				const value = formData.get(`userVars.var${v.id}`)
				// add each value to the search params object
				if (value !== null) params.set(slug, String(value))
			})

			// build a query string from the params
			const queryString = params.toString()

			// Push the string to the router
			router.push(`?${queryString}`)
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
	})
	// Get the fields from the schema
	const userVarsFields = fields.userVars.getFieldset()

	// Variable form inputs ref
	const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

	// TODO: I'm sure there's a way I don't need to have two almost identical objects just to handle state buuuuut if it works, it works
	const savedInputStates =
		Object.fromEntries(
			// Look through the page variables object
			Object.keys(pageVars).map(
				(id) => {
					// If the user variables exist, match the slug to the saved value
					const value = userVariables
						? userVariables[pageVars[id].slug]
						: pageVars[id].default_value
					return [
						id, {
							// Build an obejct with key:value pairs
							slug: pageVars[id].slug,
							value: value,
							value_length: String(value).length ?? 0
						}
					]
				}
			)
		)

	const defaultInputStates =
		Object.fromEntries(
			// Look through the page variables object
			Object.keys(pageVars).map(
				(id) => [
					id, {
						// Build an obejct with key:value pairs
						slug: pageVars[id].slug,
						value: pageVars[id].default_value,
						value_length: pageVars[id].default_value.length
					}
				]
			)
		)
	/* output example: {
		1 (panel id): {
			slug: "dudes-name",
			saved_value: "Blargen"
			default_value: "Steve",
		}
	}	*/
	const [inputStates, setInputStates] = useState(savedInputStates)

	// State of the input fields that lets them "pop in" on reset
	const [areFieldsAnimating, setAreFieldsAnimating] = useState(false)
	const runFieldAnimation = () => {
		setAreFieldsAnimating(false)
		requestAnimationFrame(() => {
			setAreFieldsAnimating(true)
		})
	}

	// RENDER
	return <>
		<VariablesForm
			varsExist={varsExist}
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			className={clsx(
				"flex",
				"flex-col",
				"gap-y-0",
			)}
		>
			{page.comic_panels &&
				// PANEL LIST
				<ul className={clsx(
					"flex",
					"flex-col",
					"gap-y-6",
					// firstLoad && "animate-fade-in",
				)}>
					{page.comic_panels.map((p, pIndex) => {

						// Conditionally render comic panels before OR after variables are submitted based on page option
						if (
							(!varsSubmitted && !p.place_after_variables_submitted) ||
							(varsSubmitted && p.place_after_variables_submitted)
						)
							// SINGLE COMIC PANEL
							return <li
								key={pIndex}
								className={clsx(
									"flex",
									"flex-col",
									"gap-y-6",
									"pb-6",
								)}>
								{p.panel_image &&
									<Image
										className={clsx(
											"lg:mt-6",
											"mx-auto",
											// firstLoad && "animate-fade-in"
										)}
										src={`${directusURL}/assets/${p.panel_image.filename_disk}.${p.panel_image.type}`}
										width={`${p.panel_image.width}`}
										height={`${p.panel_image.height}`}
										alt={`${p.panel_image.description}`}
										loading="eager"
									/>
								}
								{/* PANEL TEXT */}
								<div className={clsx(
									// "py-6",
									"lg:pt-6",
									"px-6",
									"prose",
									"text-base/loose",
									"lg:text-lg/loose",
									"max-w-2xl",
									"mx-auto",
									"text-left",
									"text-pretty",

								)}
									dangerouslySetInnerHTML={{
										__html: panelDescriptions
											&& panelDescriptions.length > 0
											? panelDescriptions[pIndex]
											: ""
									}}
								>
								</div>
								{/* VARIABLES */}
								{p.variables && p.variables.length > 0 ?
									<ComicInputSection>
										{p.variables.map((v, vIndex) => {
											const vField = userVarsFields[`var${v.id}`]
											// RENDER
											return <Field key={vIndex}>
												<ComicInputSectionRow
													as="label"
													htmlFor={vField.id}
													className={clsx(
														"cursor-pointer",
														"flex",
														"flex-col",
														"hover:bg-comic-accent-100/50",
														"outline-transparent",
														"outline-4",
														"focus-within:-outline-offset-4",
														"focus-within:outline-4",
														"focus-within:outline-comic-accent-500",
														// 
														vField.errors ? [
															"focus-within:outline-red-500",
															"bg-red-100/40",
															"hover:bg-red-100/50",
															"dark:bg-red-500/10",
															"dark:hover:bg-red-500/20",
															"dark:focus-within:bg-red-500/30",
															"dark:outline-red-500/0",
															"dark:focus-within:outline-red-500",
														] : [
															"dark:bg-neutral-800/40",
															"dark:hover:bg-comic-accent-500/10",
															"dark:hover:focus-within:bg-comic-accent-800",
															"outline-comic-accent-500/0",
														],

														// "dark:hover:bg-comic-accent-500",
														// Transition
														"hover:duration-0",
														"transition-all",
														"ease-in-out",
														"duration-300",
													)}
												>
													<div
														className={clsx(
															"pb-2",
															"text-sm",
															"font-comic-header",
															"flex",
															"items-center",
															"gap-x-1",
														)}
													>
														<span
															className={clsx(
																"text-base",
																"lg:text-lg",
																"font-comic-header",
																"font-semibold",
																vField.errors && "text-red-500",
															)}>
															{v.prompt || `${v.name}`}
														</span>
														{/* Length Checker */}
														<span className={clsx(
															"ml-auto",
															"font-normal",
															"text-xs",
															"lg:text-sm",
															"font-comic-header",
															vField.errors
																? "text-red-500/50"
																: "text-current/50"
															,
														)}>
															{`${inputStates[v.id].value_length}/32`}{/* TODO: should this be hardcoded? */}

														</span>
													</div>
													{/* INPUT */}
													<div
														className={clsx(
															"group",
															"peer",
															"relative",
															"py-2",
															"px-4",
															"pl-8",
															"w-full",
															"bg-white",
															"text-base",
															"text-left",
															"font-platform-mono",
															"rounded",
														)}
													>
														<Icon name="chevronRight"
															className={clsx(
																"absolute",
																"left-2",
																"bottom-1/2",
																"translate-y-1/2",
																"size-4",
																vField.errors ? [
																	"text-red-500",
																] : [
																	"text-neutral-400",
																	"group-focus-within:text-comic-accent-500",
																],
																// Transition
																"transition-all",
																"ease-in-out",
																"duration-300",
															)}
														/>

														{v.value_prefix &&
															<span className={clsx(
																"inline",
																"text-neutral-400",
															)}>
																{sanitize(v.value_prefix)}
															</span>
														}
														{/* Variable Input */}
														<input className={
															clsx(
																// Structure
																"inline-block",
																// Size
																"min-w-10",
																"max-w-full",
																// Appearance
																(v.value_prefix || v.value_suffix) && "border-b-2",
																"focus:border-b-comic-accent-800",
																"focus:outline-none",
																"dark:selection:bg-comic-accent-300",
																"dark:selection:text-white",
																"text-black",
																// ERRORS w/ PREFIX/SUFFIX
																(v.value_prefix || v.value_suffix)
																	&& vField.errors ? [
																	"outline-2",
																	"outline-red-500",
																	"-outline-offset-2",
																	"outline-dashed",
																	"rounded",
																	"border-b-transparent",
																	"focus:rounded-none",
																] : [
																	"border-b-black",
																],
																// ERRORS 
																vField.errors ? [
																	"focus:text-red-500",
																] : [
																	"focus:text-comic-accent-500",
																],
																"transition-all",
																"scale-100",
																// Animation
																// areFieldsAnimating ? "animate-pop-in" : ""
															)}
															onAnimationEnd={() => setAreFieldsAnimating(false)}
															ref={(i) => {
																inputRefs.current[vIndex] = i
															}}
															maxLength={32}
															id={vField.id}
															name={vField.name}
															type="text"

															value={inputStates[v.id].value}
															size={inputStates[v.id].value_length || 1}
															required
															onChange={(e) => {
																setInputStates({
																	...inputStates,
																	[v.id]: {
																		...inputStates[v.id],
																		value: e.target.value,
																		value_length: e.target.value.length
																	}
																})
															}}
														>
														</input>

														{v.value_suffix &&
															<span className={clsx(
																"inline",
																"py-2",
																"pr-4",
																"text-neutral-400",
															)}>
																{sanitize(v.value_suffix)}
															</span>
														}
													</div>
													<ComicErrorMessage className={clsx(
														"mt-1",
													)}>
														{vField.errors}
													</ComicErrorMessage>
												</ComicInputSectionRow>
											</Field>
										}
										)}
									</ComicInputSection>
									: null}
							</li>
					})
					}
				</ul>
			}


			{
				/**------------------------------
				 * SUBMIT BUTTON
				 * ---
				 * - Show ONLY if variables exist BUT they haven't been submitted
				 */
			}
			{(varsExist && !varsSubmitted) &&
				<>
					<div className={clsx(
						"px-6",
						"prose",
						"w-full",
						"max-w-2xl",
						"mx-auto",
						// firstLoad && "animate-fade-in",
					)}>
						<ComicButton as="button" type="submit" className={clsx(
						)}>
							<span className={clsx(
								"ml-5",
								"text-pretty",
								"grow",
							)}>
								{`${sanitize(page.variables_submit_button_text as string) || t("next")}`}
							</span>
							<Icon name="play" className={clsx(
								"ml-1",
								"size-4",
							)} />
						</ComicButton>
						&nbsp;
						<button className={
							clsx(
								"block",
								"mt-3",
								"cursor-pointer",
								"text-sm",
								"float-right",
								"float-end",
								"flex",
								"gap-x-1",
								"items-center",
								"p-1",
								"text-comic-accent-800",
								"dark:text-comic-accent-300/90",
								"hover:text-current/50",
								"hover:duration-0",
								"active:translate-px",
								// Transition
								"transition-all",
								"ease-in-out",
								"duration-300",
								// Outline
								"rounded",
								"outline-transparent",
								"focus:outline-2",
								"focus:outline-offset-1",
								"focus:outline-comic-accent-500",
							)}

							type="button"
							onClick={() => {
								form.reset()
								runFieldAnimation()
								setInputStates(defaultInputStates)
							}

							}>
							<Icon name="rotateLeft"
								className={clsx(
									"size-3",
								)}
							/>
							<span>
								{t("reset-variable-fields")}
							</span>
						</button>
					</div>
					<input type="hidden" name="pageVars" value={JSON.stringify(pageVars)} />
					<input type="hidden" name="comicPage" value={JSON.stringify(page)} />
				</>
			}
		</VariablesForm>
	</>
}


// Conditionally render the form if variables exist
function VariablesForm({
	varsExist,
	children,
	...props
}: ComponentPropsWithoutRef<"form"> & {
	varsExist?: boolean
	children: React.ReactNode
}) {
	// Render Form tags if vars exist
	if (varsExist)
		return <Form action="" {...props}>
			{children}
		</Form>
	// Otherwise, render nothing
	else if (!varsExist)
		return children

}

