// VALIDATION
import { PageTitleH1 } from "@/components/page"
import { getSettings } from "@/lib/directus/get-settings"
import { ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import SettingsPageForm from "./settings-client"

export default async function SettingsPageUI() {
	const settings = await getSettings()
	return <>
		<PageTitleH1>
			Site Settings
		</PageTitleH1>

		<SettingsPageForm
			fieldsLists={{
				detailFields: await getDetailFields(),
				comicTypeFields: await comicTypeFields(),
				userTypeFields: await userTypeFields()
			}}
			settings={settings}
		>


		</SettingsPageForm>
	</>
}


const getDetailFields = async () => {
	const settings = await getSettings()
	return {
		// Details
		project_name: {
			title: "Website Name",
			description: "The name of your project.",
			type: "text",
			value: settings.project_name,
			width: "half",
			validate: true,
			maxLength: 128
		},
		project_url: {
			title: "Website URL",
			description: "The publicly-accessible URL of your project.",
			type: "url",
			value: settings.project_url || "",
			width: "half",
			validate: true
		},
		routing_mode: {
			title: "Routing Mode",
			description: "Choose whether your platform will have a single creator with a single comic, a single creator with multiple comics, or multiple creators with multiple comics.",
			type: "select",
			value: settings.routing_mode,
			options: [
				{
					name: "Single Creator, Single Comic",
					value: "single-single"
				},
				{
					name: "Single Creator, Multiple Comics",
					value: "single-multiple"
				},
				{
					name: "Multiple Creators, Multiple Comics",
					value: "multiple-multiple"
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
				value: "single-single",
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
}

export const comicTypeFields = async () => {
	const settings = await getSettings()
	return {
		// Post Types
		comic_type_name: {
			title: "Series Type Name - Singular",
			description: 'i.e. `Create a new Comic` / `Subscribe to this Comic`',
			type: "text",
			value: settings.comic_type_name,
			width: "half",
			validate: true,
			maxLength: 128
		},
		comic_type_name_plural: {
			title: "Comic Type Name Plural",
			description: 'i.e. `View all Comics`	',
			type: "text",
			value: settings.comic_type_name_plural,
			width: "half",
			validate: true,
			maxLength: 128
		},
		comic_type_name_slug: {
			title: "Comic Type Slug - Singular",
			description: 'The URL-friendly slug for a single series. It appears in the URL before the series title: `dungeoncomic.com/comic/tutorial`',
			type: "text",
			value: settings.comic_type_name_slug,
			width: "half",
			validate: true,
			maxLength: 128
		},
		comic_type_name_plural_slug: {
			title: "Comic Type Slug - Plural",
			description: "The URL-friendly slug for multiple series, and links to the view all page: `dungeoncomic.com/comics`",
			type: "text",
			value: settings.comic_type_name_plural_slug,
			width: "half",
			validate: true,
			maxLength: 128
		},
	} satisfies Record<string, ListFieldsField>
}

export const userTypeFields = async () => {
	const settings = await getSettings()
	return {
		// Post Types
		user_type_name: {
			title: "User Type Name - Singular",
			description: 'i.e. `Create a new User` / `Follow this User`',
			type: "text",
			value: settings.user_type_name,
			width: "half",
			validate: true,
			maxLength: 128
		},
		user_type_name_plural: {
			title: "User Type Name Plural",
			description: 'i.e. `View all Users`	',
			type: "text",
			value: settings.user_type_name_plural,
			width: "half",
			validate: true,
			maxLength: 128
		},
		user_type_name_slug: {
			title: "User Type Slug - Singular",
			description: 'The URL-friendly slug for a single user. It appears in the URL before the series title: `dungeoncomic.com/user/enzo`',
			type: "text",
			value: settings.user_type_name_slug,
			width: "half",
			validate: true,
			maxLength: 128
		},
		user_type_name_plural_slug: {
			title: "User Type Slug - Plural",
			description: "The URL-friendly slug for multiple users, and links to the view all users page: `dungeoncomic.com/users`",
			type: "text",
			value: settings.user_type_name_plural_slug,
			width: "half",
			validate: true,
			maxLength: 128
		},
	} satisfies Record<string, ListFieldsField>
}