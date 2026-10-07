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
import { Field, Fieldset, Legend, Input, Label, Description, FieldGroup } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import { PageTitleH1 } from "@/components/page"



/**----------------------------------- */
export default function SettingsPageUI({
	settings
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
}) {


	const detailFields = {
		// Details
		project_name: {
			title: "Website Name",
			description: "The name of your project.",
			type: "text",
			value: settings.project_name,
			width: "half"
		},
		project_url: {
			title: "Website URL",
			description: "The publicly-accessible URL of your project.",
			type: "url",
			value: settings.project_url || "",
			width: "half"
		},
		routing_mode: {
			title: "Routing Mode",
			description: "Choose whether your platform will have a single creator with a single comic, a single creator with multiple comics, or multiple creators with multiple comics.",
			type: "select",
			value: settings.routing_mode,
			options: [
				{
					name: "Single Creator, Single Comic",
					value: "single/single"
				},
				{
					name: "Single Creator, Multiple Comics",
					value: "single/multiple"
				},
				{
					name: "Multiple Creators, Multiple Comics",
					value: "multiple/multiple"
				}
			],
			width: "half"
		},
		frontpage_comic: {
			title: "Frontpage Comic",
			description: "(Single creator/single comic only) Choose which comic will live at the root of the domain. If you only have one comic, it will be selected by default. If you have multiple comics, it will default to very first one by creation date -- the other comics will be inaccessible.",
			type: "select",
			value: settings.frontpage_comic ? settings.frontpage_comic.title : "",
			options: [
				{
					name: "sup",
					value: "sup"
				}
			],
			width: "half",
			conditions: {
				fieldKey: "routing_mode",
				value: "single/single",
				action: "enable",
			}
		},
		// // Post Types
		// post_type: {},
		// user_post_type: {},
		// // Homepage
		// project_logo: {},
		// project_banner: {},
		// homepage_content: {},
		// date_established: {},
		// copyright_message: {},
		// // Metadata
		// project_thumbnail: {},
		// project_description: {},
		// project_authors: {},
		// // Appearance
		// accent_color: {},

	} satisfies Record<string, ListFieldsField>


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
			Site Settings
		</PageTitleH1>
		<Fieldset className={clsx(
			"mb-6",
			"bg-neutral-100",
			"dark:bg-neutral-950",
			"p-4",
			"rounded",
		)}>
			<Legend>Details</Legend>
			<FieldGroup className={clsx(
				"grid",
				"gap-y-6",
				"md:grid",
				"md:grid-cols-2",
				"md:gap-x-12",
			)}>
				<ListFields fieldsList={detailFields} collection={settings} />
			</FieldGroup>
		</Fieldset>

		<Fieldset className={clsx(
			"mb-6",
			"bg-neutral-100",
			"dark:bg-neutral-950",
			"p-4",
			"rounded",
		)}>
			<Legend className="col-span-2">Appearance</Legend>
			<FieldGroup className={clsx(
				"grid",
				"gap-y-6",
				"md:grid",
				"md:grid-cols-2",
				"md:gap-x-12",
			)}>
				<ListFields fieldsList={appearanceFields} collection={settings} />
			</FieldGroup>
		</Fieldset>

		<ComicButton as="button">Save</ComicButton>

	</>
}


/**----------------------------------- */
// VALIDATION SCHEMA
export const settingsSchema = z.object({

})