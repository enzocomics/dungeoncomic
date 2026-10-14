/**----------------------------------- */
// LIBRARIES
// FUNCTIONS
import clsx from "clsx"
// DATA
import { fonts } from "@/styles/fonts"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Field, Fieldset, Legend, Input, Label, Description, FieldGroup, FieldGroup2Columns, FieldsetSection, FieldsetDescription } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { getFieldDescriptions, ListFields, ListFieldsField, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { PageTitleH1 } from "@/components/page"
import ThemePageForm from "./client/theme-form"
import { colorVariants } from "@/styles/colors"
import { ImageCollection } from "@/lib/directus/schema"



/**----------------------------------- */
export default async function ThemePageUI() {
	const settings = await getSettings()
	const sections = await getSections()
	const fieldDescriptions = await getFieldDescriptions(sections)
	return <>
		<PageTitleH1>
			Theme
		</PageTitleH1>
		<ThemePageForm
			sections={sections}
			descriptions={fieldDescriptions}
			settings={settings}
		/>
	</>
}

export const getLogoBackdropSettings = async () => {
	const settings = await getSettings()
	return {
		project_logo: {
			title: "Website Logo",
			description: "",
			type: "image",
			object: settings.project_logo as ImageCollection
		},
		project_banner: {
			title: "Website Background",
			description: "",
			type: "image",
			object: settings.project_banner as ImageCollection,
		},
	} satisfies Record<string, ListFieldsField>
}

const getLookFeelSettings = async () => {
	const settings = await getSettings()
	// Make an array of name: value pairs of all the tailwind colors so we can use them for the seelct menu options
	const colors = Object.entries(colorVariants).map(([name]) => ({
		name: name.charAt(0).toUpperCase() + name.slice(1),
		value: name
	})
	)
	return {
		color_accent: { // TODO: tailwind color dropdown
			title: "Website Accent Color",
			description: "",
			type: "selectColor",
			options: colors,
			value: settings.color_accent
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
}

const getSections = async () => {
	return {

		logoBackdrop: {
			legend: "Logo & Backdrop",
			description: null,
			fields: await getLogoBackdropSettings(),
			type: "logoBackdrop"
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