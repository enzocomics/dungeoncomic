"use client"
import { ComicButton } from "@/components/input/button"
import { Field, Fieldset, Legend, Input, Label, Description } from "@/components/input/fieldset"
import { Select } from "@/components/input/dropdown"
import { Listbox, ListboxOption } from "@/components/input/listbox"
import Icon from "@/styles/icons"
import { Checkbox, ListboxButton, ListboxOptions } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"
import { fonts } from "@/styles/fonts"
import { getSettings } from "@/lib/directus/get-settings"
import { useForm } from "@conform-to/react"
import { useActionState } from "react"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { ListFields, ListFieldsField } from "../functions/list-fields"


// VALIDATION SCHEMA
export const settingsSchema = z.object({

})



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
		},
		project_url: {
			title: "Website URL",
			description: "The publicly-accessible URL of your project.",
			type: "url",
			value: settings.project_url || ""
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
			]
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
			]
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
			description: "Display font",
			type: "selectFont",
			options:
				Object.values(fonts)
					.filter((f) => f.display) // only filter copy fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
		},

		project_copy_font: {
			title: "Copy Font",
			description: "Body copy font",
			type: "selectFont",
			options:
				Object.values(fonts)
					.filter((f) => f.copy) // only filter copy fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
		},

		project_mono_font: {
			title: "Mono Font",
			description: "Input fields",
			type: "selectFont",
			options:
				Object.values(fonts)
					.filter((f) => f.mono) // only filter mono fonts
					.map((f) => (
						{
							name: f.name,
							value: f.slug
						}
					)),
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
		<Fieldset>
			<Legend>Details</Legend>
			<ListFields fieldsList={detailFields} collection={settings} />


		</Fieldset>

		<Fieldset>
			<Legend>Appearance</Legend>
			<ListFields fieldsList={appearanceFields} collection={settings} />
		</Fieldset>

		<ComicButton as="button">Save</ComicButton>

	</>
}