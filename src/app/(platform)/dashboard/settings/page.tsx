import { ComicButton } from "@/components/button"
import { Input, Label } from "@/components/forms"
import Icon from "@/styles/icons"
import { Checkbox, Field, Fieldset, Legend } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"


export default function Page() {
	return <>
		<h1 className="font-platform-display text-3xl">
			Settings
		</h1>
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