"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect } from "react"
import Image from "next/image"
// VALIDATION
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
import { useChangeStatus } from "@/components/status-message"



/**----------------------------------- */
// VALIDATION SCHEMA
export const settingsSchema = (
	fieldLists?: Record<string, ListFieldsField>[]
) => {
	// Make a zod object with the provided fieldsLists
	const zObject = Object.fromEntries( // Turn the remaining pairs back into an object
		(fieldLists ?? []).flatMap((data) => // Iterate through the array
			Object.entries(data).flatMap(([key, field]) => // Turn the fieldsList object into [key,value] pairs
				"validate" in field ? [[key, field.validate] as const] : [] // Check if the pair has a validate property
			)
		).filter((item) => Object.keys(item).length > 0) // Remove any objects with 0 keys
	)

	return z.object({
		settings: z.object(zObject)
	})
}

/**----------------------------------- */
export default function SettingsPageUI({
	settings
}: {
	settings: Awaited<ReturnType<typeof getSettings>>
}) {
	const routingMode = settings.routing_mode

	const detailFields = {
		// Details
		project_name: {
			title: "Website Name",
			description: "The name of your project.",
			type: "text",
			value: settings.project_name,
			width: "half",
			validate: z.string().max(128)
		},
		project_url: {
			title: "Website URL",
			description: "The publicly-accessible URL of your project.",
			type: "url",
			value: settings.project_url || "",
			width: "half",
			validate: z.httpUrl()
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

	const comicTypeFields = {
		// Post Types
		comic_type_name: {
			title: "Series Type Name - Singular",
			description: 'i.e. `Create a new Comic` / `Subscribe to this Comic`',
			type: "text",
			value: settings.comic_type_name,
			width: "half",
			validate: z.string().max(128)
		},
		comic_type_name_plural: {
			title: "Comic Type Name Plural",
			description: 'i.e. `View all Comics`	',
			type: "text",
			value: settings.comic_type_name_plural,
			width: "half",
			validate: z.string().max(128)
		},
		comic_type_name_slug: {
			title: "Comic Type Slug - Singular",
			description: 'The URL-friendly slug for a single series. It appears in the URL before the series title: `dungeoncomic.com/comic/tutorial`',
			type: "text",
			value: settings.comic_type_name_slug,
			width: "half",
			validate: z.string().max(128)
		},
		comic_type_name_plural_slug: {
			title: "Comic Type Slug - Plural",
			description: "The URL-friendly slug for multiple series, and links to the view all page: `dungeoncomic.com/comics`",
			type: "text",
			value: settings.comic_type_name_plural_slug,
			width: "half",
			validate: z.string().max(128)
		},
	} satisfies Record<string, ListFieldsField>

	const userTypeFields = {
		// Post Types
		user_type_name: {
			title: "User Type Name - Singular",
			description: 'i.e. `Create a new User` / `Follow this User`',
			type: "text",
			value: settings.user_type_name,
			width: "half",
			validate: z.string().max(128)
		},
		user_type_name_plural: {
			title: "User Type Name Plural",
			description: 'i.e. `View all Users`	',
			type: "text",
			value: settings.user_type_name_plural,
			width: "half",
			validate: z.string().max(128)
		},
		user_type_name_slug: {
			title: "User Type Slug - Singular",
			description: 'The URL-friendly slug for a single user. It appears in the URL before the series title: `dungeoncomic.com/user/enzo`',
			type: "text",
			value: settings.user_type_name_slug,
			width: "half",
			validate: z.string().max(128)
		},
		user_type_name_plural_slug: {
			title: "User Type Slug - Plural",
			description: "The URL-friendly slug for multiple users, and links to the view all users page: `dungeoncomic.com/users`",
			type: "text",
			value: settings.user_type_name_plural_slug,
			width: "half",
			validate: z.string().max(128)
		},
	} satisfies Record<string, ListFieldsField>

	// VALIDATION


	// STATUS MESSAGES
	const setStatus = useChangeStatus("")
	const [lastResult, action] = useActionState(saveSettings, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema:
					routingMode == "multiple/multiple"
						? settingsSchema([detailFields, comicTypeFields, userTypeFields])
						: settingsSchema([detailFields])
			})
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


	return <>
		<PageTitleH1>
			Site Settings
		</PageTitleH1>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate

		>
			<FieldsetSection>
				<Legend>Details</Legend>
				<FieldGroup2Columns>
					<ListFields
						fieldsList={detailFields}
						fieldset={settingsFieldset}
						collection={settings}
					/>
				</FieldGroup2Columns>
			</FieldsetSection>

			{(settings.routing_mode === "multiple/multiple") &&
				<>
					<FieldsetSection>
						<Legend>Series Type</Legend>
						<FieldsetDescription>
							<em>Multiple Creators/Multiple Comics Routing Mode only &mdash; </em>
							If you're not making comics, or want to name your series type something else, you may change it here.
						</FieldsetDescription>
						<FieldGroup2Columns>
							<ListFields
								fieldsList={comicTypeFields}
								fieldset={settingsFieldset}
								collection={settings}
							/>
						</FieldGroup2Columns>
					</FieldsetSection>

					<FieldsetSection>
						<Legend>User Type</Legend>
						<FieldsetDescription>
							<em>Multiple Creators/Multiple Comics Routing Mode only &mdash; </em>
							You can change what you call your users here.
						</FieldsetDescription>
						<FieldGroup2Columns>
							<ListFields
								fieldsList={userTypeFields}
								fieldset={settingsFieldset}
								collection={settings}
							/>
						</FieldGroup2Columns>
					</FieldsetSection>
				</>
			}
			<ComicButton as="button" type="submit">Save</ComicButton>
		</form>

	</>
}
