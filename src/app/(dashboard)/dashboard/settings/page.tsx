import { ComicButton } from "@/components/input/button"
import { Field, Fieldset, Input, Label, Description } from "@/components/input/fieldset"
import { Select } from "@/components/input/dropdown"
import Icon from "@/styles/icons"
import { Checkbox, Legend, Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import clsx from "clsx"
import Image from "next/image"

type FieldBase = {
	title: string,
	description?: string
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
	image: {
	}
}

// Create a union of all the possible field shapes from `FieldProperties`
type Field = {
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
}[keyof FieldProperties] | {}



const fields = {
	// Details
	project_name: {
		title: "Website Name",
		description: "The name of your project.",
		type: "text"
	},
	project_url: {
		title: "Website URL",
		description: "The publicly-accessible URL of your project.",
		type: "url"
	},
	routing_mode: {
		title: "Routing Mode",
		description: "Choose whether your platform will have a single creator with a single comic, a single creator with multiple comics, or multiple creators with multiple comics.",
		type: "select",
		options: [
			{
				name: "Single Creator, Single Comic",
				value: "single/single"
			},
			{
				name: "Single Creator, Multiple Comics",
				value: "single/multiple"
			},
			{
				name: "Multiple Creators, Multiple Comics",
				value: "multiple/multiple"
			}
		]
	},
	frontpage_comic: {
		title: "Frontpage Comic",
		description: "(Single creator/single comic only) Choose which comic will live at the root of the domain. If you only have one comic, it will be selected by default. If you have multiple comics, it will default to very first one by creation date -- the other comics will be inaccessible.",
		type: "select",
		options: [
			{
				name: "sup",
				value: "sup"
			}
		]
	},
	// // Post Types
	// post_type: {},
	// user_post_type: {},
	// // Homepage
	// project_logo: {},
	// project_banner: {},
	// homepage_content: {},
	// date_established: {},
	// copyright_message: {},
	// // Metadata
	// project_thumbnail: {},
	// project_description: {},
	// project_authors: {},
	// // Appearance
	// accent_color: {},
	// project_fonts: {},
} satisfies Record<string, Field>

export default function Page() {
	return <>
		<h1 className="font-comic-display text-3xl mb-6">
			Site Settings
		</h1>
		<Fieldset>
			{/* <Legend>Your profile</Legend> */}

			{Object.entries(fields).map(([name, field], index) => (
				<Field key={index}>
					<Label>{field.title}</Label>
					<Description>{field.description}</Description>
					{field.type === "text" &&
						<Input type="text" />
					}
					{field.type === "url" &&
						<Input type="text" />
					}
					{field.type === "select" &&
						<>
							<Select name={name}>
								{field.options.map((o, i) => (
									<option key={i} value={o.value}>
										{o.name}
									</option>
								))}
							</Select>
						</>
					}
				</Field>
			))}

			<ComicButton as="button">Save</ComicButton>

		</Fieldset>

	</>
}