"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Select } from "@/components/input/dropdown"
import { Field, Fieldset, Input, Label, Description, ErrorMessage } from "@/components/input/fieldset"
import { Listbox, ListboxOption } from "@/components/input/listbox"
import z, { ZodURL } from "zod"
import { SubmissionResult } from "@conform-to/react"
import { ChangeEvent, useEffect, useRef, useState } from "react"

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
		validate?: z.ZodString
	},
	url: {
		validate?: z.ZodUnion<readonly [ZodURL, ZodURL]>
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
	fieldsList,
	collection,
	collectionName,
	fieldset,
	lastResult,
}: {
	fieldsList: Record<string, ListFieldsField>
	collection?: Awaited<ReturnType<typeof getSettings>>
	collectionName?: string
	fieldset?: any // TODO
	lastResult?: SubmissionResult<string[]>

}) {

	const initialValues = Object.entries(fieldsList).map(([name, singleField], index) => {
		return { name: name, value: singleField.value }
	})

	const [fieldValues, setFieldValues] = useState(initialValues)
	const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

	function handleSelect(e: ChangeEvent<HTMLSelectElement, HTMLSelectElement>, index: number) {
		const tempArray = [...fieldValues]
		tempArray[index].value = e.target.value
		// console.log(tempArray)
		// inputRefs.current[index]
		// console.log(inputRefs.current)
		setFieldValues(tempArray)
		// console.log(tempArray)
		// console.log(index, e.target.value)
	}

	useEffect(() => {
		if (lastResult?.status === "success") {
			// console.log(lastResult)
			// console.log(inputRefs.current[0]?.value)
			// console.log(inputRefs.current[2]?.value)
		}
	}, [lastResult])


	// console.log(lastResult)
	// Loop through a fieldsList object and output UI depending on what kind of field it is
	return <>
		{Object.entries(fieldsList).map(([name, singleField], index) => {
			// let value = collection ? collection[name as keyof typeof collection] : null
			let disabled = false

			let value = lastResult && lastResult.status == "success" && collectionName
				? lastResult?.initialValue?.[collectionName][name as keyof typeof collection]
				: singleField.value
			// console.log(String(lastResult?.initialValue?.[collectionName][name as keyof typeof collection]))

			// const [value, setValue] = useState(initialValue)

			useEffect(() => {
				if (lastResult && lastResult.status === "success" && collectionName) {
					// const thisthing = lastResult.initialValue?.[collectionName][name as keyof typeof collection]
					// console.log(thisthing)
					// setValue(thisthing)
				}
			}, [lastResult])


			// singleField.type === "select" &&
			// 	console.log({
			// 		value,
			// 		options: singleField.options.map((option) => option.value),
			// 	});

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

			// console.log(String(lastResult && lastResult.initialValue && lastResult.initialValue))
			return <Field key={index} disabled={disabled} className={clsx(
				// singleField.width == "half" && [
				// 	// "w-1/2",
				// ]
			)}>
				<Label
					htmlFor={fieldset ? fieldset[name].name : name}>{singleField.title}</Label>

				{/**----------------------------------- */}
				{
					singleField.type === "text" &&
					<Input
						id={fieldset ? fieldset[name].name : name}
						name={fieldset ? fieldset[name].name : name}
						key={fieldset && fieldset[name].key}
						type="text"
						ref={(i) => {
							inputRefs.current[index] = i
						}}
						defaultValue={value} />
				}

				{/**----------------------------------- */}
				{
					singleField.type === "url" &&
					<Input
						ref={(i) => {
							inputRefs.current[index] = i
						}}
						id={fieldset ? fieldset[name].name : name}
						name={fieldset ? fieldset[name].name : name}
						key={fieldset && fieldset[name].key}
						type="text"
						defaultValue={value} />
				}

				{/**----------------------------------- */}
				{
					singleField.type === "select" &&
					<>
						<Select
							ref={(i) => {
								inputRefs.current[index] = i
							}}
							id={fieldset && fieldset[name].name}
							name={fieldset && fieldset[name].name}
							key={fieldset && fieldset[name].key}
							// defaultValue={value}
							value={fieldValues[index].value}
							onChange={(e) => handleSelect(e, index)}
						// value={value}
						// onChange={(e) => setValue(e.target.value)}
						>
							{singleField.options.map((o, i) => (
								<option key={i}
									value={o.value}
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
							defaultValue={value}
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
				<Description>{singleField.description}</Description>
				{/**----------------------------------- */}
			</Field >
		})}
	</>
}