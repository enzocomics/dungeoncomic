import { ComicButton } from "@/components/button"
import { Input, Label } from "@/components/forms"
import { Textarea } from "@/components/textarea"
import { Field, Fieldset, Legend } from "@headlessui/react"
import Image from "next/image"

export default function Page() {
	return <>
		<h1 className="font-platform-display text-3xl">
			Profile
		</h1>
		<Fieldset>
			{/* <Legend>Your profile</Legend> */}
			<Field>
				<Label>Avatar</Label>
				<Image src="/apple-touch-icon.png" width="64" height="64" alt="" />
			</Field>
			<Field>
				<Label>Name</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Label>Pronouns</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Label>Location</Label>
				<Input type="text" />
			</Field>

			<Field>
				<Label>Homepage</Label>
				<Input type="text" />
			</Field>
			<Field>
				<Label>About Me</Label>
				<Textarea />
			</Field>
			<Field>
				<Label>Social Links</Label>
				<Input type="text" />
			</Field>

			<ComicButton as="button">Save</ComicButton>
		</Fieldset>
	</>
}