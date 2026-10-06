"use client"
import { ComicButton } from "@/components/input/button"
import { Field, Fieldset, Input, Label, Description } from "@/components/input/fieldset"
import { Select } from "@/components/input/dropdown"
import { Listbox, ListboxOption } from "@/components/input/listbox"

import clsx from "clsx"

import { getSettings } from "@/lib/directus/get-settings"


type FieldBase = {
	title: string,
	description?: string,
	condition?: boolean,
	value?: string,
	width?: "half" | "full"
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




export function ListFields({
	fieldsList,
	collection
}: {
	fieldsList: Record<string, ListFieldsField>,
	collection?: Awaited<ReturnType<typeof getSettings>>
}) {
	return <>
		{Object.entries(fieldsList).map(([name, singleField], index) => {
			let value = collection ? collection[name as keyof typeof collection] : null

			return <Field key={index}>
				<Label>{singleField.title}</Label>
				<Description>{singleField.description}</Description>
				{singleField.type === "text" &&
					<Input type="text" defaultValue={String(singleField.value)} />
				}
				{singleField.type === "url" &&
					<Input type="text" defaultValue={String(singleField.value)} />
				}
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
				{singleField.type === "selectFont" &&
					<>
						<Listbox name={name}>
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
			</Field>
		})}
	</>

	// return Object.entries(fieldsList).map(([name, singleField], index) => {
	// 	let value = collection[name as keyof Awaited<ReturnType<typeof getSettings>>]

	// 	return <Field key={index}>
	// 		<Label>{singleField.title}</Label>
	// 		<Description>{singleField.description}</Description>
	// 		{singleField.type === "text" &&
	// 			<Input type="text" defaultValue={String(singleField.value)} />
	// 		}
	// 		{singleField.type === "url" &&
	// 			<Input type="text" defaultValue={String(singleField.value)} />
	// 		}
	// 		{singleField.type === "select" &&
	// 			<>
	// 				<Select name={name} defaultValue={String(singleField.value)}>
	// 					{singleField.options.map((o, i) => (
	// 						<option key={i} value={o.value}>
	// 							{o.name}
	// 						</option>
	// 					))}
	// 				</Select>
	// 			</>
	// 		}
	// 		{singleField.type === "selectFont" &&
	// 			<>
	// 				<Listbox name={name}>
	// 					{singleField.options.map((o, i) => (
	// 						<ListboxOption key={i} value={o.value}
	// 							style={{
	// 								fontFamily: `var(--font-${o.value})`
	// 							}}
	// 							className={clsx(
	// 								"text-2xl"
	// 							)}
	// 						>
	// 							{o.name}
	// 						</ListboxOption>
	// 					))}

	// 				</Listbox>
	// 			</>
	// 		}
	// 	</Field>
	// })

}