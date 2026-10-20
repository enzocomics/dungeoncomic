import { ComicButton } from "@/components/input/button"
import { Input, Label } from "@/components/input/fieldset"
import { PageTitleH1 } from "@/components/page"
import Icon from "@/styles/icons"
import { Checkbox, Field, Fieldset, Legend } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"

export default function AccountPageUI() {
	return <>
		<PageTitleH1>
			Account
		</PageTitleH1>
		<Fieldset>
			{/* <Legend>Your profile</Legend> */}

			<Field>
				<Label>Email*</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Checkbox>
					<Icon name="circleCheck" className={clsx("size-5")} />
				</Checkbox>
				<Label>Email Visible</Label>
			</Field>
			<Field>
				<Label>Username*</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Label>Password</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Label>Confirm Password</Label>
				<Input type="text" />
			</Field>
			<ComicButton as="button">Save</ComicButton>

		</Fieldset>

		<Fieldset>
			<button>Delete Account</button>
		</Fieldset>
	</>
}