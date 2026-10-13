"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm, useInputControl } from "@conform-to/react"
// FUNCTIONS
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription, FieldGroup, Fieldset, Input, Field, Label, Description } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { useChangeStatus } from "@/components/status-message"
import { settingsSchema } from "@/ui/dashboard/functions/settings-schema"
// import { Input, Listbox, ListboxButton, ListboxOptions, ListboxSelectedOption } from "@headlessui/react"
import { ListboxOption } from "@/components/catalyst/listbox"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"


/**----------------------------------- */
export default function ThemePageForm({
	descriptions,
	sections,
	settings
}: {
	descriptions: any
	sections: SettingsSection
	settings: Awaited<ReturnType<typeof getSettings>>
}) {

	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const [lastResult, action] = useActionState(saveSettings, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: settingsSchema([
					sections.logoBackdrop.fields,
					sections.lookFeel.fields,
					sections.fonts.fields
				])
			})
		},
		onSubmit() {
			// router.refresh()
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput"
	})

	const settingsFieldset = fields.settings.getFieldset()

	useEffect(() => {
		if (lastResult?.status == "success") {
			setStatus("success", "Your settings have been saved.")
		}
	}, [lastResult])

	// RENDER
	return <>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			onReset={(e) => {
				e.preventDefault()
			}}
		>
			{Object.entries(sections).map(([name, section], index) => {
				if (section.type == "logoBackdrop")
					return <Fieldset key={index} className={clsx(
						"rounded",
						"mb-6",
						"bg-neutral-100",
						"dark:bg-neutral-950",
						"rounded",
					)}>
						<Legend className={clsx("p-4")}>Logo & Backdrop</Legend>
						<div className={clsx(
							"relative",
						)}>
							{settings.project_logo ?
								<Image
									src={`${directusURL}/assets/${settings.project_logo.filename_disk}`}
									alt={settings.project_logo.description || ""}
									width={settings.project_logo.width || "320"}
									height={settings.project_logo.height || "240"}
									className={clsx(
										"w-auto",
										"h-12",
										"md:h-30",
										"absolute",
										"left-1/2",
										"top-1/2",
										"-translate-1/2",
										"drop-shadow-black/50",
										"drop-shadow-sm"
									)
									}
								/>
								:
								<div className={clsx(
									"w-48",
									"h-12",
									"md:h-30",
									"absolute",
									"left-1/2",
									"top-1/2",
									"-translate-1/2",
									"bg-black/5",
									"dark:bg-white/15",
									"border-2",
									"border-neutral-400",
									"text-neutral-500",
									"border-dashed",
									// "flex",
									// "items-center",
									// "justify-center",
									"rounded"

								)}>
									<div className={clsx(
										"p-2",
										"font-platform-labels",
										"flex",
										"items-center",
										"gap-2"
									)}>
										<Icon name="image" className={clsx(
											"size-5",
										)} />
										<span>
											Logo
										</span>
									</div>
								</div>
							}

							<div className={clsx(
								"block",
								"aspect-60/16",
								"w-full",
								"h-auto",
								"bg-cover",
								"bg-top",
								"bg-local",
								"bg-blend-saturation",
								settings.project_banner ? [
								] : [
									"bg-black/5",
									"dark:bg-white/15",
									"border-2",
									"border-neutral-300",
									"text-neutral-400",
									"border-dashed",
								]
							)}
								style={{
									backgroundImage: settings.project_banner ? `url(${directusURL}/assets/${settings.project_banner.filename_disk})` : undefined
								}}
							>
								<div className={clsx(
									"p-2",
									"font-platform-labels",
									"flex",
									"items-center",
									"gap-2"
								)}>
									<Icon name="image" className={clsx(
										"size-5",
									)} />
									<span>
										Backdrop
									</span>
								</div>
							</div>


						</div>
						<div className={clsx(
							"p-4",
						)}>
							<div className={clsx(
								"grid",
								"grid-cols-2",
								"space-x-8",
								"pb-4",
							)}>
								<Field className={clsx(
								)}>
									<Label>Logo</Label>
									<input type="file" name="settings.project_logo"
										defaultValue={settings.project_logo?.filename_disk}
										className={clsx(
											"mb-0",
											"font-platform-labels",
											"w-full"
										)}
									/>

									<Description>Logo Recommendations:<br />
										- Landscape aspect ratio (max 3:1)<br />
										- Transparency<br />
										- Solid colour stroke<br />
										- JPEG | PNG | GIF | WEBP</Description>
								</Field>
								<Field>
									<Label>Banner</Label>
									<input type="file" name="settings.project_banner"
										defaultValue={settings.project_banner?.filename_disk}
										className={clsx(
											"mb-0",
											"font-platform-labels",
											"w-full"
										)}
									/>
									<Description>Backdrop Recommendations:<br />
										- 1600x400px (4:1 aspect ratio)<br />
										- JPEG | PNG | GIF | WEBP
									</Description>
								</Field>
							</div>
						</div>
					</Fieldset>
				else
					return <FieldsetSection key={index}>
						<Legend>{section.legend}</Legend>
						{section.description &&
							<FieldsetDescription
								dangerouslySetInnerHTML={{
									__html: section.description
								}}
							/>
						}
						<FieldGroup2Columns>
							<ListFields
								fieldsList={section.fields}
								fieldset={settingsFieldset}
								fieldDescriptions={descriptions[name].fields}
								collection={settings}
							/>
						</FieldGroup2Columns>
					</FieldsetSection>
			})}

			<ComicButton as="button" type="submit"
				className={clsx(
					"sticky",
					"bottom-4",
				)}
			>Save</ComicButton>
		</form >

	</>
}
