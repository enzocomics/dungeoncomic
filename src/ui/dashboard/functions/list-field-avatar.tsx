"use client"

import { SmallComicButton } from "@/components/input/button"
import { Description, ErrorMessage, Field, Label } from "@/components/input/fieldset"
import Icon from "@/styles/icons"
import { FieldMetadata } from "@conform-to/react"
import clsx from "clsx"
import { marked } from "marked"
import { ChangeEvent, useRef, useState } from "react"
import { ListFieldsField } from "./list-fields"
import Image from "next/image"
import { directusURL } from "@/data/env"

export default function SingleAvatarField({
	fieldset,
	singleField,
}: {
	fieldset?: FieldMetadata<unknown, Record<string, Record<string, unknown>>, string[]>
	singleField?: ListFieldsField
}) {
	const avatarInputRef = useRef<HTMLInputElement>(null)

	const avatarObject = singleField?.type == "image" && singleField.object ? singleField.object : undefined
	const hasAvatar = !!avatarObject

	// Avatar States
	const [avatarPreview, setAvatarPreview] = useState<string | null>(`${directusURL}/assets/${avatarObject?.filename_disk}`)

	const [isAvatarPreviewing, setAvatarPreviewing] = useState(false)
	const [clearAvatar, setClearAvatar] = useState(false)

	// Avatar Handlers
	const handleAvatarPreview = (e: ChangeEvent<HTMLInputElement>) => {
		setClearAvatar(false)
		setAvatarPreviewing(true)
		setAvatarPreview(URL.createObjectURL(e.currentTarget.files?.[0] as Blob))
	}

	const handleAvatarDelete = () => {
		setAvatarPreviewing(false)
		setClearAvatar(true)
		setAvatarPreview(null)
	}


	console.log(avatarPreview)
	return <>
		<Field className={clsx(
			// "md:col-span-2",
			singleField?.width == "full" && [
				"md:col-span-2",
				"max-w-prose",
			]
		)}>
			{/* <Label optional={true}>Avatar</Label> */}
			<div className={clsx(
				"my-3",
				"flex",
				"flex-col",
				"sm:flex-row",
				"sm:place-content-center",
				"gap-4"
			)}>

				{(hasAvatar || (!hasAvatar && isAvatarPreviewing)) && avatarPreview !== null ?
					<div className={clsx(
						"grid",
						"place-content-center",
					)}>
						<div className={clsx(
							"relative",
							"min-w-32",
							"aspect-square",
							"md:min-w-24",
							"mx-auto",
							"sm:mx-0",
							"grid",
							"",
						)}>
							<Image
								src={avatarPreview}
								alt={avatarObject?.description || ""}
								width={avatarObject?.width || "128"}
								height={avatarObject?.height || "128"}
								className={clsx(
									"w-32",
									"md:w-24",
									"lg:w-32",
									"aspect-square",
									// "h-32",
									"rounded",
									"object-cover"
								)}
							/>
							<button type="button" className={clsx(
								"cursor-pointer",
								"active:translate-px",
								"absolute",
								"-top-2",
								"-right-2",
								"drop-shadow-black/50",
								"drop-shadow-sm",
								"size-5",
								"bg-red-500",
								"flex",
								"items-center",
								"justify-center",
								"rounded-full",
								"hover:bg-red-700",
								"hover:duration-0",
								"transition-all",
								"duration-300",
								"ease-in-out",
							)}
								onClick={(e) => handleAvatarDelete()}
							>
								<Icon name="xmark" className={clsx(
									"size-3",
									"text-white",
								)} />
							</button>
						</div>
					</div>
					:
					<div className={clsx(
						"grid",
						"place-content-center",
					)}>
						<div className={clsx(
							"min-w-32",
							"aspect-square",
							"md:min-w-24",
							"lg:min-w-32",
							"border-2",
							"border-neutral-400",
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
									Avatar
								</span>
							</div>
						</div>
					</div>
				}
				<div className={clsx(
					"grid",
					"place-content-center"
				)}>
					<SmallComicButton
						onClick={() => avatarInputRef.current?.click()}
						className={clsx(
							"text-base",
							// "w-64",
							"justify-center",
							"mb-3",
						)}
					>
						Change Avatar
					</SmallComicButton>
					<input type="file"
						name={fieldset?.name}
						key={fieldset?.key}
						ref={avatarInputRef}
						className={clsx(
							"hidden",
							"mb-0",
							"font-platform-labels",
							"w-full"
						)}
						onChange={(e) => handleAvatarPreview(e)}
					/>
					<ErrorMessage>{fieldset?.errors}</ErrorMessage>
					<Description dangerouslySetInnerHTML={{
						__html: marked.parse(
							"Image Recommendations:\n" +
							"- Square aspect ratio (1:1)\n" +
							"- JPEG | PNG | GIF | WEBP\n" +
							"- 1MB max"
						)
					}} />
				</div>
			</div>
		</Field>
		{clearAvatar &&
			<>
				<input type="hidden"
					name="avatar_clear"
					value="true"
				/>
				<input type="hidden"
					name="avatar_id"
					defaultValue={avatarObject?.id}
				/>
			</>
		}
	</>
}