import { ComicButton } from "@/components/input/button"
import { Input, Label } from "@/components/input/fieldset"
import { PageTitleH1 } from "@/components/page"

import Icon from "@/styles/icons"
import { Checkbox, Field, Fieldset, Legend } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"
import AccountPageForm from "./client/account-form"
import { verifySession } from "@/data/session"
import { ListFieldsField } from "../functions/list-fields"
import { getSettings } from "@/lib/directus/get-settings"

export default async function AccountPageUI() {
	// const settings = await getSettings()
	const session = await verifySession()
	const sections = await getSections()
	return <>
		<PageTitleH1>
			My Account
		</PageTitleH1>
		<AccountPageForm
			sections={sections}
			// settings={settings}
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
			type: "text",
			value: session?.username || "",
			validate: true,
			maxLength: 32
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
