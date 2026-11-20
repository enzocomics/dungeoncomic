import ProfilePageUI from "@/ui/dashboard/pages/profile"
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
	// 			<Label>Social Links</Label>
	// 			<Input type="text" />
	// 		</Field>

	// 		<ComicButton as="button">Save</ComicButton>
	// 	</Fieldset>
	// </>
}