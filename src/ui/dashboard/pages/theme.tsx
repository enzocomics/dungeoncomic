"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState } from "react"
import Image from "next/image"
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
// FUNCTIONS
import clsx from "clsx"
// DATA
import { fonts } from "@/styles/fonts"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Select } from "@/components/input/dropdown"
import { Field, Fieldset, Legend, Input, Label, Description, FieldGroup, FieldGroup2Columns, FieldsetSection, FieldsetDescription } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import { PageTitleH1 } from "@/components/page"



/**----------------------------------- */
export default function ThemePageUI({
	settings
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
}) {

	const appearanceFields = {
		font_headers: {
			title: "Headers Font",
			description: "Page titles will appear in this font. If your website does not have an logo image uploaded, your website title will also appear in this font.",
			type: "selectFont",
			value: settings.font_headers,
			options:
				Object.values(fonts)
					.filter((f) => f.headers) // only filter headers fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},


		font_labels: {
			title: "Labels Font",
			description: "Input labels, input descriptions, and buttons will appear in this font.",
			type: "selectFont",
			value: settings.font_labels,
			options:
				Object.values(fonts)
					.filter((f) => f.labels) // only filter labels fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},

		font_copy: {
			title: "Text Font",
			description: "Story text, image captions, and body copy will appear in this font",
			type: "selectFont",
			value: settings.font_copy,
			options:
				Object.values(fonts)
					.filter((f) => f.copy) // only filter copy fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},

		font_mono: {
			title: "Mono Font",
			description: "Input fields and story variables will appear in this font.",
			type: "selectFont",
			value: settings.font_mono,
			options:
				Object.values(fonts)
					.filter((f) => f.mono) // only filter mono fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},

	} satisfies Record<string, ListFieldsField>

	// VALIDATION
	const [lastResult, action] = useActionState(saveSettings, undefined)
	const [form, fields] = useForm({
		lastResult,
		// onValidate({ formData }) {
		// 	return parseWithZod(formData, { settingsSchema })
		// },
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput"
	})


	return <>
		<PageTitleH1>
			Theme
		</PageTitleH1>

		<FieldsetSection>
			<Legend>Fonts</Legend>
			<FieldGroup2Columns>
				<ListFields fieldsList={appearanceFields} collection={settings} />
			</FieldGroup2Columns>
		</FieldsetSection>

		<ComicButton as="button">Save</ComicButton>

	</>
}


/**----------------------------------- */
// VALIDATION SCHEMA
export const settingsSchema = z.object({

})