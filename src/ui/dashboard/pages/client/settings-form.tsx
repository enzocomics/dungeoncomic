"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
// FUNCTIONS
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { useChangeStatus } from "@/components/status-message"
import { settingsSchema } from "@/ui/dashboard/functions/settings-schema"
import clsx from "clsx"


/**----------------------------------- */
export default function SettingsPageForm({
	descriptions,
	sections,
	settings
}: {
	descriptions: any
	sections: SettingsSection
	settings: Awaited<ReturnType<typeof getSettings>>
}) {

	// STATUS MESSAGES
	const setStatus = useChangeStatus("")

	// VALIDATION
	const initialSchemaState = settings.routing_mode === "multiple-multiple"
		? [sections.details.fields, sections.comicType.fields, sections.userType.fields]
		: [sections.details.fields]
	const [schemaState, setSchemaState] = useState(initialSchemaState)
	const [lastResult, action] = useActionState(saveSettings, undefined)

	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, {
				schema: settingsSchema(schemaState)
			})
		},
		onSubmit() {
			// router.refresh()
		},
		shouldValidate: "onBlur",
		shouldRevalidate: "onInput"
	})

	const settingsFieldset = fields.settings.getFieldset()

	useEffect(() => {
		if (lastResult?.status == "success") {
			setStatus("success", "Your settings have been saved.")
			// router.refresh()
		}
	}, [lastResult])

	const inputRefs = useRef<Record<string, HTMLSelectElement | null>>({})
	const [hideTypes, setHideTypes] = useState(!(settings.routing_mode === "multiple-multiple"))

	// Show/Hide additional UI depending on the routing mode selection
	useEffect(() => {
		// Grab the select menu refs we need
		const routingModeSelect = inputRefs.current["settings.routing_mode"]
		const frontpageSelect = inputRefs.current["settings.frontpage_comic"]
		if (!routingModeSelect || !frontpageSelect) return

		// Get the parent FIELD element of the frontpage comic select
		const frontpageSelectField = frontpageSelect.parentElement?.parentElement

		// Hide the TYPES section unless `multiple-multiple` is selected
		// Hide the FRONTPAGE COMIC select menu unless `single-single` is selected
		const handleRoutingMode = () => {
			// TODO: It's probably better to target the field's `disabled` prop but I honestly can't deal with that right now sorry for this mess
			if (routingModeSelect.value === "multiple-multiple") {
				frontpageSelectField?.setAttribute("data-disabled", "true")
				frontpageSelectField?.setAttribute("disabled", "true")
				frontpageSelectField?.setAttribute("aria-disabled", "true")
				frontpageSelectField?.setAttribute("data-headlessui-state", "disabled")
				frontpageSelect?.setAttribute("data-disabled", "true")
				frontpageSelect?.setAttribute("disabled", "true")
				frontpageSelect?.setAttribute("aria-disabled", "true")
				frontpageSelect?.setAttribute("data-headlessui-state", "disabled")
				setSchemaState([sections.details.fields, sections.comicType.fields, sections.userType.fields])
				setHideTypes(false)
			}
			else if (routingModeSelect.value === "single-single") {
				frontpageSelectField?.removeAttribute("data-disabled")
				frontpageSelectField?.removeAttribute("disabled")
				frontpageSelectField?.setAttribute("aria-disabled", "false")
				frontpageSelectField?.setAttribute("data-headlessui-state", "")
				frontpageSelect?.removeAttribute("data-disabled")
				frontpageSelect?.removeAttribute("disabled")
				frontpageSelect?.setAttribute("aria-disabled", "false")
				frontpageSelect?.setAttribute("data-headlessui-state", "")
				setSchemaState([sections.details.fields])
				setHideTypes(true)
			} else {
				frontpageSelectField?.setAttribute("data-disabled", "true")
				frontpageSelectField?.setAttribute("disabled", "true")
				frontpageSelectField?.setAttribute("aria-disabled", "true")
				frontpageSelectField?.setAttribute("data-headlessui-state", "disabled")
				frontpageSelect?.setAttribute("data-disabled", "true")
				frontpageSelect?.setAttribute("disabled", "true")
				frontpageSelect?.setAttribute("aria-disabled", "true")
				frontpageSelect?.setAttribute("data-headlessui-state", "disabled")
				setSchemaState([sections.details.fields])
				setHideTypes(true)
			}

		}

		// Listener for the routing mode select menu
		routingModeSelect.addEventListener("change", handleRoutingMode)

		handleRoutingMode()

		// Cleanup
		return () => {
			routingModeSelect.removeEventListener("change", handleRoutingMode)
		}
	}, [])
	// RENDER
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
					<></>
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
							fieldDescriptions={descriptions[name].fields}
							collection={settings}
							inputRefs={inputRefs}
							disableAll={name !== "details" && hideTypes}
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
