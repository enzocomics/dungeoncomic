/**----------------------------------- */
// LIBRARIES
import Link from "next/link"
import clsx from "clsx"
// DATA
import { fonts } from "@/styles/fonts"
import { getSettings } from "@/lib/directus/get-settings"
// import { verifySession } from "@/data/session"
// UI
import Icon from "@/styles/icons"
import { colorVariants } from "@/styles/colors"
import { PageTitleH1 } from "@/components/page"
import { getFieldDescriptions, ListFieldsField, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import DashboardForm from "@/ui/dashboard/components/client/form"
// import CreateComicForm from "./client/comic-create-form"

export default async function CreateComicPageUI() {
	const settings = await getSettings()
	const sections = await getSections()
	const fieldDescriptions = await getFieldDescriptions(sections)

	return <>
		<PageTitleH1>
			<span className={clsx(
				"flex",
				"items-center",
				"space-x-2",
			)}>
				<Link href="/dashboard" className={clsx(
					"flex",
					"items-center",
					"text-base-content/50",
				)}>
					<Icon name="house" className={clsx("size-5")} />
					<span className="sr-only">Dashboard Home</span>
				</Link>
				<Icon name="chevronRight" className={clsx(
					"size-4",
					"mr-2",
					"text-base-content/50",
				)} />
				<span>Create New {settings.comic_type_name}</span>
			</span>
		</PageTitleH1>
		<DashboardForm
			collection="comics"
			descriptions={fieldDescriptions}
			sections={sections}
		/>
	</>
}

const getDetailFields = async () => {
	// const session = await verifySession()
	return {
		title: {
			title: "Title",
			description: "",
			type: "text",
			validate: true,
			width: "full",
		},
		slug: {
			title: "Slug",
			description: "",
			type: "text",
			validate: true,
			width: "full",
		},
		description: {
			title: "Description",
			description: "",
			type: "textarea",
			optional: true,
			width: "full",
		},
		spacer: {
			title: "",
			description: "",
			type: "blank"
		}
	} satisfies Record<string, ListFieldsField>
}
export const getLogoBackdropFields = async () => {
	return {
		logo: {
			title: "Logo",
			description: "",
			type: "image",
			validate: true,
			object: null
		},
		banner: {
			title: "Banner",
			description: "",
			type: "image",
			validate: true,
			object: null
		},
	} satisfies Record<string, ListFieldsField>
}

const getLookFeelSettings = async () => {
	// Make an array of name: value pairs of all the tailwind colors so we can use them for the seelct menu options
	const colors = Object.entries(colorVariants).map(([name]) => ({
		name: name.charAt(0).toUpperCase() + name.slice(1),
		value: name
	})
	)
	// const session = await verifySession()
	return {
		color_accent: { // TODO: tailwind color dropdown
			title: "Accent Color",
			description: "",
			type: "selectColor",
			options: colors,
			value: "red",
			optional: true
		},

	} satisfies Record<string, ListFieldsField>
}

const getFontFields = async () => {
	const settings = await getSettings()
	return {
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
			width: "half",
			optional: true
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
			width: "half",
			optional: true
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
			width: "half",
			optional: true
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
			width: "half",
			optional: true
		},

	} satisfies Record<string, ListFieldsField>
}

const getSections = async () => {
	const settings = await getSettings()
	return {
		details: {
			legend: ``,
			description: null,
			fields: await getDetailFields()
		},
		lookFeel: {
			legend: "Look & Feel",
			description: null,
			fields: await getLookFeelSettings()
		},
		fonts: {
			legend: "Fonts",
			description: null,
			fields: await getFontFields()
		},
	} satisfies SettingsSection
}