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
import { Field, Fieldset, Legend, Input, Label, Description } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, ListFieldsField } from "@/ui/dashboard/functions/list-fields"



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
		project_display_font: {
			title: "Display Font",
			description: "Page titles will appear in this font. If your website does not have an logo image uploaded, your website title will also appear in this font.",
			type: "selectFont",
			value: settings.project_display_font,
			options:
				Object.values(fonts)
					.filter((f) => f.display) // only filter copy fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},


		project_header_font: {
			title: "Header Font",
			description: "Headings, input labels, and buttons will appear in this font.",
			type: "selectFont",
			value: settings.project_header_font,
			options:
				Object.values(fonts)
					.filter((f) => f.header) // only filter copy fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
			width: "half"
		},

		project_copy_font: {
			title: "Text Font",
			description: "Descriptions, captions, and body text will appear in this font",
			type: "selectFont",
			value: settings.project_copy_font,
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

		project_mono_font: {
			title: "Mono Font",
			description: "Input fields and story variables will appear in this font.",
			type: "selectFont",
			value: settings.project_mono_font,
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
		<h1 className="font-comic-display text-3xl mb-6">
			Site Settings
		</h1>
		<Fieldset className={clsx(
			"md:grid",
			"md:grid-cols-2",
			"md:space-x-6",
		)}>
			<Legend className="col-span-2">Details</Legend>
			<ListFields fieldsList={detailFields} collection={settings} />
		</Fieldset>

		<Fieldset className={clsx(
			"md:grid",
			"md:grid-cols-2",
			"md:space-x-6",
		)}>
			<Legend className="col-span-2">Appearance</Legend>
			<ListFields fieldsList={appearanceFields} collection={settings} />
		</Fieldset>

		<ComicButton as="button">Save</ComicButton>

	</>
}


/**----------------------------------- */
// VALIDATION SCHEMA
export const settingsSchema = z.object({

})