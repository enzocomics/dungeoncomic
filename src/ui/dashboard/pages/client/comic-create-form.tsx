"use client"
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



export default function CreateComicForm({
	sections,
}: {
	sections: SettingsSection
}) {
	return <>
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
					// fieldset={profileFieldset}
					// collection={session}
					/>
				</FieldGroup2Columns>
			</FieldsetSection>
		})}

		<ComicButton as="button" type="submit"
			className={clsx(
				"sticky",
				"bottom-4",
			)}
		>Create Dungeon</ComicButton>
	</>
}