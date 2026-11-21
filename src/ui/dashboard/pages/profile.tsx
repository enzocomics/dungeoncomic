/**----------------------------------- */
// DATA
import { verifySession } from "@/data/session"
// UI
import { PageTitleH1 } from "@/components/page"
import ProfilePageForm from "@/ui/dashboard/pages/client/profile-form"
import { ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import type { ImageCollection } from "@/lib/directus/schema"

export default async function ProfilePageUI() {
	const sections = await getSections()
	const session = await verifySession()
	return <>
		<PageTitleH1>
			My Profile
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
			object: session?.avatar as ImageCollection,
		},
		name: {
			title: "Name",
			description: "",
			type: "text",
			value: session?.name || "",
			validate: true,
			optional: true,
			maxLength: 64
		},
		spacer: {
			title: "",
			type: "blank"
		},
		description: {
			title: "Bio",
			description: "",
			width: "full",
			type: "textarea",
			value: session?.description || "",
			validate: true,
			optional: true,
			maxLength: 1000
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