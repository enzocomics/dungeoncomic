/**----------------------------------- */
// DATA
import { verifySession } from "@/data/session"
// UI
import { PageTitleH1 } from "@/components/page"
import AccountPageForm from "@/ui/dashboard/pages/client/account-form"
import { ListFieldsField } from "@/ui/dashboard/functions/list-fields"

export default async function AccountPageUI() {
	const session = await verifySession()
	const sections = await getSections()
	return <>
		<PageTitleH1>
			My Account
		</PageTitleH1>
		<AccountPageForm
			sections={sections}
			session={session}
		/>
	</>

}

const getDetailFields = async () => {
	const session = await verifySession()
	return {
		// Details
		username: {
			title: "Username",
			description: "",
			type: "username",
			value: session?.username || "",
			validate: true,
			maxLength: 24
		},
		email: {
			title: "Email",
			description: "",
			type: "email",
			value: session?.email || "",
			validate: true,
		},
	} satisfies Record<string, ListFieldsField>
}

const getPasswordFields = async () => {
	const session = await verifySession()
	return {
		password_current: {
			title: "Current Password",
			description: "",
			type: "password",
			// value: session?.email || "",
			validate: true,
		},
		spacer: {
			title: "",
			type: "blank"
		},
		password_new: {
			title: "New Password",
			description: "",
			type: "password",
			// value: session?.email || "",
			validate: true,
		},
		password_new_confirm: {
			title: "Confirm New Password",
			description: "",
			type: "password",
			// value: session?.email || "",
			validate: true,
		},
	} satisfies Record<string, ListFieldsField>
}

const getSections = async () => {
	return {
		details: {
			legend: "Settings",
			description: null,
			fields: await getDetailFields()
		},
		// password: {
		// 	legend: "Change Password",
		// 	description: "",
		// 	fields: await getPasswordFields()
		// }
	}
}
// return <>
// 	<PageTitleH1>
// 		Account
// 	</PageTitleH1>
// 	<Fieldset>
// 		{/* <Legend>Your profile</Legend> */}

// 		<Field>
// 			<Checkbox>
// 				<Icon name="circleCheck" className={clsx("size-5")} />
// 			</Checkbox>
// 			<Label>Email Visible</Label>
// 		</Field>

// 	</Fieldset>

// 	<Fieldset>
// 		<button>Delete Account</button>
// 	</Fieldset>
// </>
