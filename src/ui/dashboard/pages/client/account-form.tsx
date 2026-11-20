"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect } from "react"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm, useInputControl } from "@conform-to/react"
// FUNCTIONS
// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription, Input, ErrorMessage, Field, Label } from "@/components/input/fieldset"
import { ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { useChangeStatus } from "@/components/status-message"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"

import clsx from "clsx"
import { saveAccount } from "@/ui/dashboard/actions/account"
import type { verifySession } from "@/data/session"
import { registerSchema } from "@/lib/zod/schemas/pages"
import { useTranslations } from "next-intl"
import { accountSchema } from "../../functions/schema-account"

export default function AccountPageForm({
	sections,
	session,

}: {
	sections: SettingsSection
	session: Awaited<ReturnType<typeof verifySession>>

}) {

	const t = useTranslations("auth")
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const [lastResult, action] = useActionState(saveAccount, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				// schema: (intent) => dashboardSchema({
				// 	name: "directus_users",
				// 	fieldLists: [
				// 		sections.details.fields,
				// 		// sections.password.fields,
				// 	],
				// 	intent: intent
				// })
				schema: (intent) => accountSchema(t, intent)
			})
		},
		onSubmit() {
			// router.refresh()
			console.log(lastResult)
		},
		// shouldValidate: "onBlur",
		// shouldRevalidate: "onInput"
	})

	// const settingsFieldset = fields.directus_users.getFieldset()

	useEffect(() => {
		if (lastResult?.status == "success") {
			setStatus("success", "Your account has been updated")
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
					<Legend>{section.legend}</Legend>
					{section.description &&
						<FieldsetDescription
							dangerouslySetInnerHTML={{
								__html: section.description
							}}
						/>
					}
					<FieldGroup2Columns>
						<Field>
							<Label>
								Username
							</Label>
							<Input
								id={fields.username.id}
								name={fields.username.name}
								key={fields.username.key}
								type="text"
								defaultValue={sections.details.fields.username.value}
							/>
							<ErrorMessage>{fields.username.errors}</ErrorMessage>
						</Field>

						<Field>
							<Label>
								Email
							</Label>
							<Input
								id={fields.email.id}
								name={fields.email.name}
								key={fields.email.key}
								type="text"
								defaultValue={sections.details.fields.email.value}
							/>
							<ErrorMessage>{fields.email.errors}</ErrorMessage>
						</Field>
						<Field>
							<Label>
								Password
							</Label>
							<Input
								id={fields.password.id}
								name={fields.password.name}
								key={fields.password.key}
								type="password"

							/>
							<ErrorMessage>{fields.password.errors}</ErrorMessage>
						</Field>
						<Field>
							<Label>
								Confirm Password
							</Label>
							<Input
								id={fields.passwordConfirm.id}
								name={fields.passwordConfirm.name}
								key={fields.passwordConfirm.key}
								type="password"

							/>
							<ErrorMessage>{fields.passwordConfirm.errors}</ErrorMessage>
						</Field>
					</FieldGroup2Columns>
				</FieldsetSection>
			})}

			<ComicButton as="button" type="submit"
				className={clsx(
					"sticky",
					"bottom-4",
				)}
			>Save</ComicButton>
		</form>
	</>
}