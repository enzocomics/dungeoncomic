"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Select } from "@/components/input/dropdown"
import { Field, Fieldset, Input, Label, Description } from "@/components/input/fieldset"
import { Listbox, ListboxOption } from "@/components/input/listbox"

/**----------------------------------- */
// TYPES
type FieldBase = {
	title: string,
	description?: string,
	condition?: boolean,
	value?: string,
	width?: "half" | "full",
	conditions?: {
		fieldKey: string,
		value: string | string[],
		action: "enable" | "disable"
	}
}

type FieldProperties = {
	text: {},
	url: {},
	select: {
		options: {
			name: string
			value: string
		}[]
	},
	selectFont: {
		options: {
			name: string
			value: string
		}[]
	},
	image: {
	}
}

/**----------------------------------- */
// Create a union of all the possible field shapes from `FieldProperties`
export type ListFieldsField = {
	// Loop through the keys of `FieldProperties` and create an intermediate object with this shape:
	// {
	//   text: BaseField & {
	//     type: "text";
	//   } & FieldProperties["text"];
	// }
	[T in keyof FieldProperties]: FieldBase & {
		type: T
	} & FieldProperties[T]
	// Index the intermediate object with all its keys, which produces a union of the corresponding property types
	// I.E. TextField | UrlField | DropdownField | ImageField
}[keyof FieldProperties]


/**----------------------------------- */
export function ListFields({
	fieldsList,
	collection
}: {
	fieldsList: Record<string, ListFieldsField>,
	collection?: Awaited<ReturnType<typeof getSettings>>
}) {
	// Loop through a fieldsList object and output UI depending on what kind of field it is
	return <>
		{Object.entries(fieldsList).map(([name, singleField], index) => {
			let value = collection ? collection[name as keyof typeof collection] : null
			let disabled = false
			// Check if the field has any conditions
			if (singleField.conditions) {
				// Check the value of another field in the same list
				let conditionSetting = collection && collection[
					singleField.conditions.fieldKey as keyof typeof collection
				]

				const values = Array.isArray(singleField.conditions.value)
					? singleField.conditions.value
					: [singleField.conditions.value]

				console.log(conditionSetting)
				console.log(values)
				if (!values.includes(String(conditionSetting))) {
					disabled = true
				}
			}

			return <Field key={index} disabled={disabled} className={clsx(
				singleField.width == "half" && [
					// "w-1/2",
				]

			)}>
				<Label>{singleField.title}</Label>

				{/**----------------------------------- */}
				{singleField.type === "text" &&
					<Input type="text" defaultValue={String(singleField.value)} />
				}

				{/**----------------------------------- */}
				{singleField.type === "url" &&
					<Input type="text" defaultValue={String(singleField.value)} />
				}

				{/**----------------------------------- */}
				{singleField.type === "select" &&
					<>
						<Select name={name} defaultValue={String(singleField.value)}>
							{singleField.options.map((o, i) => (
								<option key={i} value={o.value}>
									{o.name}
								</option>
							))}
						</Select>
					</>
				}

				{/**----------------------------------- */}
				{singleField.type === "selectFont" &&
					<>
						<Listbox name={name} defaultValue={String(singleField.value)}>
							{singleField.options.map((o, i) => (
								<ListboxOption key={i} value={o.value}
									style={{
										fontFamily: `var(--font-${o.value})`
									}}
									className={clsx(
										"text-2xl"
									)}
								>
									{o.name}
								</ListboxOption>
							))}
						</Listbox>
					</>
				}

				<Description>{singleField.description}</Description>
				{/**----------------------------------- */}
			</Field>
		})}
	</>
}