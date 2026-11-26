"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
// VALIDATION
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
// DATA
// FUNCTIONS
import clsx from "clsx"
// ACTIONS
import { saveDashboardForm } from "@/ui/dashboard/actions/form"
// UI
import { ComicButton } from "@/components/input/button"
import { useChangeStatus } from "@/components/status-message"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription, FieldGroup, Fieldset, Input, Field, Label, Description } from "@/components/input/fieldset"
import { dashboardSchema } from "@/ui/dashboard/functions/schema"
import { getFieldDescriptions, ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { ListLogoBackdropFields } from "@/ui/dashboard/functions/list-fields-logo-backdrop"

export type CollectionDataAction = "create" | "update"

export type CollectionData = {
	name: string,
	action: CollectionDataAction,
	comicID?: number
}

/** ---
 * Builds Dashboard Forms UI
 * 
 * @param sections
 * 
 */
export default function DashboardForm({
	collection,
	descriptions,
	sections
}: {
	collection: CollectionData
	descriptions: Awaited<ReturnType<typeof getFieldDescriptions>>
	sections: SettingsSection
}) {
	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const [lastResult, action] = useActionState(saveDashboardForm, undefined)

	// Get the fieldLists from each section
	const fieldLists = Object.values(sections).map(section => section.fields)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: dashboardSchema({
					name: collection.name,
					fieldLists: fieldLists
				})
			})
		}
	})

	const fieldset = fields[collection.name].getFieldset()

	useEffect(() => {
		if (lastResult?.status === "success") {
			setStatus("success", "Your settings have been saved")
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
				if (section.type == "logoBackdrop")
					return <ListLogoBackdropFields
						key={index}
						logo={section.fields["logo"]}
						backdrop={section.fields["banner"]}
						fieldset={fieldset}
						type="comic"
					/>
				else
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
								fieldset={fieldset}
								fieldDescriptions={descriptions[name].fields}
							/>
						</FieldGroup2Columns>
					</FieldsetSection>
			})}
			<input type="hidden"
				name="schema"
				defaultValue={collection.name}
			/>
			<input type="hidden"
				name="action"
				defaultValue={collection.action}
			/>
			<ComicButton as="button" type="submit"
				className={clsx(
					"sticky",
					"bottom-4",
				)}
			>Save</ComicButton>
		</form >
	</>
}