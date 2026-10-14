/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { Select } from "@/components/input/dropdown"
import { Field, Input, Label, Description, ErrorMessage, FieldDescription } from "@/components/input/fieldset"
import { Listbox, ListboxOption } from "@/components/input/listbox"
import { FieldMetadata } from "@conform-to/react"
import { marked } from "marked"
import Icon from "@/styles/icons"
import { ImageCollection } from "@/lib/directus/schema"

/**----------------------------------- */
// TYPES

export type SettingsSection = Record<string, {
	legend: string,
	description: string | null,
	fields: Record<string, ListFieldsField>
	type?: string
}>

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
	},
}

type FieldProperties = {
	text: {
		validate?: boolean
		maxLength?: number
	},
	url: {
		validate?: boolean
	},
	select: {
		options: {
			name: string
			value: string | number
		}[],
	},
	selectFont: {
		options: {
			name: string
			value: string
		}[]
	},
	selectColor: {
		options: {
			name: string
			value: string
		}[]
	},
	image: {
		object: ImageCollection | null
	},
	custom: {}
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

/** 
 * This function create a nested object that awaits the description of each field in each section with the following shape:
 * {
 * 		sectionName: {
 * 			fields: {
 * 				fieldName: {
 * 					descripton: "markdown-parsed description"
 * 				}
 * 			}
 * 		}
 * }
 * This shape matches the shape of the sections object so that it can be mapped in the same way
 */
export async function getFieldDescriptions(sections: Record<
	string,
	{ fields: Record<string, { description: string }> }
>) {
	const resolvedSections = sections
	return Object.fromEntries(
		await Promise.all(
			Object.entries(resolvedSections).map(async ([name, section]) => [
				name,
				{
					fields: Object.fromEntries(
						await Promise.all(
							Object.entries(section.fields).map(async ([fName, field]) => [
								fName,
								{
									description: await marked.parse(field.description)
								}
							])
						)
					)
				}
			])
		)
	)
}
/**----------------------------------- */
export function ListFields({
	collection,
	disableAll = false,
	fieldsList,
	fieldset,
	fieldDescriptions,
	inputRefs
}: {
	fieldsList: Record<string, ListFieldsField>
	disableAll?: boolean
	collection?: Awaited<ReturnType<typeof getSettings>>
	fieldset?: Required<{
		[x: string]: FieldMetadata<unknown, Record<
			string, Record<string, unknown>
		>, string[]>
	}>
	fieldDescriptions?: Record<string, Record<string, string>>
	inputRefs?: React.RefObject<
		Record<string, HTMLSelectElement | null>
	>

}) {
	// Loop through a fieldsList object and output UI depending on what kind of field it is
	return <>
		{Object.entries(fieldsList).map(([name, singleField], index) => {
			// let value = collection ? collection[name as keyof typeof collect7ion] : null
			let disabled = false

			let value = singleField.value

			// Check if the field has any conditions
			if (singleField.conditions) {
				// Check the value of another field in the same list
				let conditionSetting = collection && collection[
					singleField.conditions.fieldKey as keyof typeof collection
				]

				const values = Array.isArray(singleField.conditions.value)
					? singleField.conditions.value
					: [singleField.conditions.value]

				if (!values.includes(String(conditionSetting))) {
					disabled = true
				}
			}

			return <Field key={index} disabled={disableAll || disabled} className={clsx(
				// singleField.width == "half" && [
				// 	// "w-1/2",
				// ]
			)}>
				<Label>
					{singleField.title}
				</Label>

				{/**----------------------------------- */}
				{
					singleField.type === "text" &&
					<Input
						id={fieldset && fieldset[name].name}
						name={fieldset && fieldset[name].name}
						key={fieldset && fieldset[name].key}
						type="text"
						defaultValue={singleField.value} />
				}

				{/**----------------------------------- */}
				{
					singleField.type === "url" &&
					<Input
						id={fieldset && fieldset[name].name}
						name={fieldset && fieldset[name].name}
						key={fieldset && fieldset[name].key}
						type="text"
						defaultValue={singleField.value} />
				}

				{/**----------------------------------- */}
				{
					singleField.type === "select" &&
					<>
						<Select
							id={fieldset && fieldset[name].name}
							name={fieldset && fieldset[name].name}
							defaultValue={singleField.value}
							inputRefs={inputRefs}
						>
							{singleField.options.map((o, i) => (
								<option key={i}
									value={(o.value)}
								>
									{o.name}
								</option>
							))}
						</Select>
					</>
				}

				{/**----------------------------------- */}
				{
					singleField.type === "selectFont" &&
					<>
						<Listbox
							// id={fieldset && fieldset[name].name}
							name={fieldset && fieldset[name].name}
							loadedValue={singleField.value}
							conformField={fieldset && fieldset[name]}
						>

							{singleField.options.map((o, i) => (

								<ListboxOption key={o.value} value={o.value}
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
				{/**----------------------------------- */}
				{
					singleField.type === "selectColor" &&
					<>
						<Listbox
							// id={fieldset && fieldset[name].name}
							name={fieldset && fieldset[name].name}
							loadedValue={singleField.value}
							conformField={fieldset && fieldset[name]}
						>

							{singleField.options.map((o, i) => (
								<ListboxOption key={o.value} value={o.value}
									style={{
										fontFamily: `var(--font-${o.value})`
									}}

									data-select="color"
									className={clsx(
										"flex",
										"items-center",
										"gap-x-2",
									)}
								>
									<Icon name="circleSolid"
										className={clsx(
											"size-4",
											"rounded-full",
										)}
										style={{
											color: `var(--color-${o.value}-500)`
										}}
									/>
									{o.name}
								</ListboxOption>
							))}
						</Listbox>
					</>
				}
				{
					fieldset &&
					<ErrorMessage>{fieldset[name].errors}</ErrorMessage>
				}
				{fieldDescriptions?.[name].description &&
					<Description dangerouslySetInnerHTML={{
						__html: fieldDescriptions?.[name].description
					}} />
				}
				{/**----------------------------------- */}
			</Field >
		})}
	</>
}