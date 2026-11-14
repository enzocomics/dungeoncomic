import { PageTitleH1 } from "@/components/page"
import { verifySession } from "@/data/session"
import { ListFieldsField } from "@/ui/dashboard/functions/list-fields"
import ProfilePageForm from "./client/profile-form"

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
		name: {
			title: "Name",
			description: "",
			type: "text",
			value: session?.name || "",
			validate: true,
			maxLength: 128
		}
	} satisfies Record<string, ListFieldsField>
}

const getSections = async () => {
	return {
		details: {
			legend: "Details",
			description: null,
			fields: await getDetailFields()
		}
	}
}