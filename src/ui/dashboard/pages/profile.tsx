/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// STYLES
import Icon from "@/styles/icons"
// DATA
import type { ImageCollection } from "@/lib/directus/schema"
import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { PageTitleH1 } from "@/components/page"
import { getFieldDescriptions, ListFieldsField, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import DashboardForm from "@/ui/dashboard/components/client/form"

/**----------------------------------- */
export default async function ProfilePageUI() {
	const sections = await getSections()
	const session = await verifySession()
	const settings = await getSettings()
	const fieldDescriptions = await getFieldDescriptions(sections)
	return <>
		<PageTitleH1 className={clsx(
			"flex",
			"items-center",
		)}>
			<span className={clsx(
				"grow"
			)}>
				My Profile</span>
			{settings.routing_mode === "multiple-multiple" &&
				<ComicButton as="link"
					href={`/${settings.user_type_name_slug}/${session?.username}`}
					className={clsx(
						"w-auto!",
						"text-sm!",
						"h-10",
					)}>
					<Icon name="user" className={clsx(
						"size-4",
						"mr-2"
					)} />
					View Public Profile
				</ComicButton>
			}
		</PageTitleH1>
		<DashboardForm
			collection={{
				name: "directus_users",
				action: "update",
				messages: {
					submissionSuccess: `Profile has been updated.`,
					submitButton: `Save Changes`
				},
			}}
			descriptions={fieldDescriptions}
			sections={sections}
		/>
	</>
}

const getDetailFields = async () => {
	const session = await verifySession()
	return {
		// Details
		// TODO: Avatar
		avatar: {
			title: "Avatar",
			description: "",
			type: "image",
			width: "full",
			object: session?.avatar as ImageCollection,
		},
		name: {
			title: "Name",
			description: "",
			type: "text",
			width: "full",
			value: session?.name || "",
			validate: true,
			optional: true,
			maxLength: 64
		},
		description: {
			title: "Bio",
			description: "",
			width: "full",
			type: "textarea",
			value: session?.description || "",
			validate: true,
			optional: true,
			maxLength: 160
		},
		spacer: {
			title: "",
			description: "",
			type: "blank"
		},
		// location: {
		// 	title: "Location",
		// 	description: "",
		// 	type: "text",
		// 	value: session?.location || "",
		// 	validate: true,
		// 	optional: true,
		// 	maxLength: 64
		// },
	} satisfies Record<string, ListFieldsField>
}

const getSocialFields = async () => {
	const session = await verifySession()
	return {
		homepage_url: {
			title: "Homepage",
			description: "",
			type: "url",
			value: session?.homepage_url || "",
			validate: true,
			optional: true,
		}
	} satisfies Record<string, ListFieldsField>
}


const getSections = async () => {
	return {
		details: {
			legend: "Details",
			description: null,
			fields: await getDetailFields()
		},
		// socials: {
		// 	legend: "Socials",
		// 	description: null,
		// 	fields: await getSocialFields()
		// }
	} satisfies SettingsSection
}