"use client"
/**----------------------------------- */
// LIBRARIES
import { useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm, useInputControl } from "@conform-to/react"
// FUNCTIONS
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription, FieldGroup, Fieldset, Input, Field, Label, Description } from "@/components/input/fieldset"
import { saveSettings } from "@/ui/dashboard/actions/settings"
import { ListFields, ListFieldsField, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import { useChangeStatus } from "@/components/status-message"
import { settingsSchema } from "@/ui/dashboard/functions/settings-schema"
// import { Input, Listbox, ListboxButton, ListboxOptions, ListboxSelectedOption } from "@headlessui/react"
import { ListboxOption } from "@/components/catalyst/listbox"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"
import { getComic } from "@/lib/directus/get-comics"


export function ListLogoBackdropFields({
	logo,
	backdrop,
	type
}: {
	logo: ListFieldsField
	backdrop: ListFieldsField
	type: "settings" | "comic"
}) {

	const logoFieldName = type == "settings" ? "settings.project_logo" : "logo"
	const backdropFieldName = type == "settings" ? "settings.project_banner" : "banner"

	const logoObject = logo.type === "image" && logo.object ? logo.object : undefined
	const hasLogo = logo.type === "image" && logo.object && logoObject


	const backdropObject = backdrop.type === "image" && backdrop.object ? backdrop.object : undefined
	const hasBackdrop = backdrop.type === "image" && backdrop.object && backdropObject

	return <Fieldset className={clsx(
		"rounded",
		"mb-6",
		"bg-neutral-100",
		"dark:bg-neutral-950",
		"rounded",
	)}>
		<Legend className={clsx("p-4")}>Logo & Backdrop</Legend>
		<div className={clsx(
			"relative",
		)}>
			{hasLogo ?
				<Image
					src={`${directusURL}/assets/${logoObject.filename_disk}`}
					alt={logoObject.description || ""}
					width={logoObject.width || "320"}
					height={logoObject.height || "240"}
					className={clsx(
						"w-auto",
						"h-12",
						"md:h-30",
						"absolute",
						"left-1/2",
						"top-1/2",
						"-translate-1/2",
						"drop-shadow-black/50",
						"drop-shadow-sm"
					)
					}
				/>
				:
				<div className={clsx(
					"w-48",
					"h-12",
					"md:h-30",
					"absolute",
					"left-1/2",
					"top-1/2",
					"-translate-1/2",
					"bg-black/5",
					"dark:bg-white/15",
					"border-2",
					"border-neutral-400",
					"text-neutral-500",
					"border-dashed",
					// "flex",
					// "items-center",
					// "justify-center",
					"rounded"

				)}>
					<div className={clsx(
						"p-2",
						"font-platform-labels",
						"flex",
						"items-center",
						"gap-2"
					)}>
						<Icon name="image" className={clsx(
							"size-5",
						)} />
						<span>
							Logo
						</span>
					</div>
				</div>
			}

			<div className={clsx(
				"block",
				"aspect-60/16",
				"w-full",
				"h-auto",
				hasBackdrop ? [
					"bg-cover",
					"bg-top",
					"bg-local",
					"bg-blend-saturation",
				] : [
					"bg-black/5",
					"dark:bg-white/15",
					"border-2",
					"border-neutral-300",
					"text-neutral-400",
					"border-dashed",
				]
			)}
				style={{
					backgroundImage: hasBackdrop ? `url(${directusURL}/assets/${backdropObject.filename_disk})`
						: undefined
				}}
			>
				<div className={clsx(
					"p-2",
					"font-platform-labels",
					"flex",
					"items-center",
					"gap-2",

				)}>
					<Icon name="image" className={clsx(
						"size-5",
					)} />
					<span>
						Backdrop
					</span>
				</div>
			</div>


		</div>
		<div className={clsx(
			"p-4",
		)}>
			<div className={clsx(
				"grid",
				"grid-cols-2",
				"space-x-8",
				"pb-4",
			)}>
				<Field className={clsx(
				)}>
					<Label>Logo</Label>
					<input type="file" name={logoFieldName}
						defaultValue={hasLogo ? logoObject.filename_disk : undefined}
						className={clsx(
							"mb-0",
							"font-platform-labels",
							"w-full"
						)}
					/>

					<Description>Logo Recommendations:<br />
						- Landscape aspect ratio (max 3:1)<br />
						- Transparency<br />
						- Solid colour stroke<br />
						- JPEG | PNG | GIF | WEBP</Description>
				</Field>
				<Field>
					<Label>Banner</Label>
					<input type="file" name={backdropFieldName}
						defaultValue={hasBackdrop ? backdropObject.filename_disk : undefined}
						className={clsx(
							"mb-0",
							"font-platform-labels",
							"w-full"
						)}
					/>
					<Description>Backdrop Recommendations:<br />
						- 1600x400px (4:1 aspect ratio)<br />
						- JPEG | PNG | GIF | WEBP
					</Description>
				</Field>
			</div>
		</div>
	</Fieldset>
}