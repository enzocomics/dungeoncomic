/**----------------------------------- */
// DATA
import { verifySession } from "@/data/session"
// UI
import { PageTitleH1 } from "@/components/page"
import ProfilePageForm from "@/ui/dashboard/pages/client/profile-form"
import { ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import type { ImageCollection } from "@/lib/directus/schema"
import { ComicButton } from "@/components/input/button"
import clsx from "clsx"
import { getSettings } from "@/lib/directus/get-settings"
import Icon from "@/styles/icons"

export default async function ProfilePageUI() {
	const sections = await getSections()
	const session = await verifySession()
	const settings = await getSettings()
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
		<ProfilePageForm
			sections={sections}
			session={session}
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
	}
}