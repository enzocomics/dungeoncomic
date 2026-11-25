"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect } from "react"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
// TYPES
import type { verifySession } from "@/data/session"
// FUNCTIONS
import clsx from "clsx"
// UI
import { ComicButton } from "@/components/input/button"
import { FieldGroup2Columns, FieldsetDescription, FieldsetSection, Legend } from "@/components/input/fieldset"
import { useChangeStatus } from "@/components/status-message"
import { saveProfile } from "@/ui/dashboard/actions/profile"
import { ListFields, type SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"

export default function ProfilePageForm({
	sections,
	session,
}: {
	sections: SettingsSection
	session: Awaited<ReturnType<typeof verifySession>>
}) {
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const [lastResult, action] = useActionState(saveProfile, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: dashboardSchema({
					name: "directus_users",
					fieldLists: [
						sections.details.fields,
						// sections.socials.fields
					]
				})
			})
		},
		onSubmit() {

		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput"
	})

	const profileFieldset = fields.directus_users.getFieldset()

	useEffect(() => {
		if (lastResult?.status == "success") {
			setStatus("success", "Your profile has been updated")
		}
	}, [lastResult])


	return <>
		<form
			id={form.id}
			onSubmit={form.onSubmit}
			action={action}
			noValidate
			onReset={(e) => {
				e.preventDefault()
			}}
		>
			{Object.entries(sections).map(([name, section], index) => {
				return <FieldsetSection key={index}>
					{section.legend &&
						<Legend>{section.legend}</Legend>
					}
					{section.description &&
						<FieldsetDescription
							dangerouslySetInnerHTML={{
								__html: section.description
							}}
						/>
					}
					<FieldGroup2Columns>
						<ListFields
							fieldsList={section.fields}
							fieldset={profileFieldset}
							collection={session}
						/>
					</FieldGroup2Columns>
				</FieldsetSection>
			})}
			<input
				// Submits the username so we can update the tag
				type="hidden"
				name="username"
				defaultValue={session?.username || ""}
			/>
			<ComicButton as="button" type="submit"
				className={clsx(
					"sticky",
					"bottom-4",
				)}
			>Save</ComicButton>
		</form>
	</>
}