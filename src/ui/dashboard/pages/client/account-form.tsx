"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm, useInputControl } from "@conform-to/react"
// FUNCTIONS
// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { useChangeStatus } from "@/components/status-message"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"

import clsx from "clsx"
import type { getSettings } from "@/lib/directus/get-settings"
import { saveAccount } from "../../actions/account"
import type { verifySession } from "@/data/session"

export default function AccountPageForm({
	sections,
	// settings,
	session,

}: {
	sections: SettingsSection
	// settings: Awaited<ReturnType<typeof getSettings>>
	session: Awaited<ReturnType<typeof verifySession>>

}) {
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const [lastResult, action] = useActionState(saveAccount, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: (intent) => dashboardSchema(
					"directus_users", [
					sections.details.fields,
					// sections.password.fields,
				])
			})
		},
		onSubmit() {
			// router.refresh()
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput"
	})

	const settingsFieldset = fields.directus_users.getFieldset()

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
						<ListFields
							fieldsList={section.fields}
							fieldset={settingsFieldset}
							// fieldDescriptions={descriptions[name].fields}
							collection={session}
						// inputRefs={inputRefs}
						// disableAll={name !== "details" && hideTypes}
						/>
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