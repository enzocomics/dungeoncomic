import { ComicButton } from "@/components/input/button"
import { Input, Label } from "@/components/input/fieldset"
import { Textarea } from "@/components/input/textarea"
import { PageTitleH1 } from "@/components/page"
import ProfilePageUI from "@/ui/dashboard/pages/profile"
import { Field, Fieldset, Legend } from "@headlessui/react"
import Image from "next/image"
import { connection } from "next/server"

export const instant = false

export default async function Page() {
	await connection()
	return <ProfilePageUI />
	// return <>
	// 	<PageTitleH1>
	// 		Profile
	// 	</PageTitleH1>
	// 	<Fieldset>
	// 		{/* <Legend>Your profile</Legend> */}
	// 		<Field>
	// 			<Label>Avatar</Label>
	// 			<Image src="/apple-touch-icon.png" width="64" height="64" alt="" />
	// 		</Field>
	// 		<Field>
	// 			<Label>Name</Label>
	// 			<Input type="text" />
	// 		</Field>
	// 		<Field>
	// 			<Label>Pronouns</Label>
	// 			<Input type="text" />
	// 		</Field>
	// 		<Field>
	// 			<Label>Location</Label>
	// 			<Input type="text" />
	// 		</Field>

	// 		<Field>
	// 			<Label>Homepage</Label>
	// 			<Input type="text" />
	// 		</Field>
	// 		<Field>
	// 			<Label>About Me</Label>
	// 			<Textarea />
	// 		</Field>
	// 		<Field>
	// 			<Label>Social Links</Label>
	// 			<Input type="text" />
	// 		</Field>

	// 		<ComicButton as="button">Save</ComicButton>
	// 	</Fieldset>
	// </>
}