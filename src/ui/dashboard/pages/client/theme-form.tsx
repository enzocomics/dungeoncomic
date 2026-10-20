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
import { ListLogoBackdropFields } from "@/ui/dashboard/functions/list-fields-logo-backdrop"


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
					return <ListLogoBackdropFields
						key={index}
						logo={section.fields["project_logo"]}
						backdrop={section.fields["project_banner"]}
						fieldset={settingsFieldset}
						type="settings"
					/>
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
