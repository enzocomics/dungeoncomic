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

export default async function AccountPageUI() {
	const sections = await getSections()
	return <>
		<PageTitleH1>
			My Account
		</PageTitleH1>
		<AccountPageForm
			sections={sections}

		/>
	</>

}

const getDetailFields = async () => {
	const session = await verifySession()
	return {
		// Details
		email: {
			title: "Email",
			description: "",
			type: "text",
			value: session?.email || "",
			validate: true,
		},
		username: {
			title: "Username",
			description: "",
			type: "text",
			value: session?.username || "",
			validate: true,
		},
	} satisfies Record<string, ListFieldsField>
}

const getSections = async () => {
	return {
		details: {
			legend: "Details",
			description: null,
			fields: await getDetailFields()
		},
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
// 		<Field>
// 			<Label>Password</Label>
// 			<Input type="text" />
// 		</Field>
// 		<Field>
// 			<Label>Confirm Password</Label>
// 			<Input type="text" />
// 		</Field>
// 		<ComicButton as="button">Save</ComicButton>

// 	</Fieldset>

// 	<Fieldset>
// 		<button>Delete Account</button>
// 	</Fieldset>
// </>
