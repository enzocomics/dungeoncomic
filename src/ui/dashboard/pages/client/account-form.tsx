"use client"

// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription } from "@/components/input/fieldset"
import { ListFields, SettingsSection } from "@/ui/dashboard/functions/list-fields"

import clsx from "clsx"

export default function AccountPageForm({
	sections,
}: {
	sections: SettingsSection
}) {
	return <>
		<form
			// id={form.id}
			// onSubmit={form.onSubmit}
			// action={action}
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
						// fieldset={settingsFieldset}
						// fieldDescriptions={descriptions[name].fields}
						// collection={settings}
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