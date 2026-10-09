/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { Select } from "@/components/input/dropdown"
import { Field, Input, Label, Description, ErrorMessage } from "@/components/input/fieldset"
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
	collection,
	disableAll = false,
	fieldsList,
	fieldset,
	inputRefs
}: {
	fieldsList: Record<string, ListFieldsField>
	disableAll?: boolean
	collection?: Awaited<ReturnType<typeof getSettings>>
	fieldset?: any // TODO
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
				<Label
					htmlFor={fieldset ? fieldset[name].name : name}>
					{singleField.title}
				</Label>

				{/**----------------------------------- */}
				{
					singleField.type === "text" &&
					<Input
						id={fieldset ? fieldset[name].name : name}
						name={fieldset ? fieldset[name].name : name}
						key={fieldset && fieldset[name].key}
						type="text"
						defaultValue={singleField.value} />
				}

				{/**----------------------------------- */}
				{
					singleField.type === "url" &&
					<Input
						id={fieldset ? fieldset[name].name : name}
						name={fieldset ? fieldset[name].name : name}
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
							name={fieldset ? fieldset[name].name : name}
							key={fieldset && fieldset[name].key}
							defaultValue={singleField.value}
						>

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
				{
					fieldset &&
					<ErrorMessage>{fieldset[name].errors}</ErrorMessage>
				}
				<Description>
					{singleField.description}
				</Description>
				{/**----------------------------------- */}
			</Field >
		})}
	</>
}