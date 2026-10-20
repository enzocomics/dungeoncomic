"use client"
/**----------------------------------- */
// LIBRARIES
import { ChangeEvent, useActionState, useEffect, useRef, useState } from "react"
import Image from "next/image"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { FieldMetadata, useForm, useInputControl } from "@conform-to/react"
// FUNCTIONS
// DATA
import { getSettings } from "@/lib/directus/get-settings"
// UI
import { ComicButton, SmallComicButton } from "@/components/input/button"
import { Legend, FieldGroup2Columns, FieldsetSection, FieldsetDescription, FieldGroup, Fieldset, Input, Field, Label, Description, ErrorMessage } from "@/components/input/fieldset"
import { ListFields, ListFieldsField, SettingsSection } from "@/ui/dashboard/functions/list-fields"
import clsx from "clsx"
import { directusURL } from "@/data/env"
import Icon from "@/styles/icons"


export function ListLogoBackdropFields({
	logo,
	backdrop,
	type,
	fieldset
}: {
	logo: ListFieldsField
	backdrop: ListFieldsField
	type: "settings" | "comic"
	fieldset?: Required<{
		[x: string]: FieldMetadata<unknown, Record<
			string, Record<string, unknown>
		>, string[]>
	}>
}) {
	// Initial Values

	const logoFieldName = type == "settings" ? "project_logo" : "logo"
	const backdropFieldName = type == "settings" ? "project_banner" : "banner"

	// const logoFileFieldName = type == "settings" ? "project_logo_file" : "logo"
	// const backdropFileFieldName = type == "settings" ? "project_banner_file" : "banner"

	const logoClearFieldName = type == "settings" ? "settings.project_logo_file_clear" : "logo_clear"
	const backdropClearFieldName = type == "settings" ? "settings.project_banner_file_clear" : "banner_clear"

	const logoIDName = type == "settings" ? "settings.project_logo_id" : "logo_id"
	const backdropIDName = type == "settings" ? "settings.project_banner_id" : "banner_id"

	const logoObject = logo.type === "image" && logo.object ? logo.object : undefined
	const hasLogo = logo.type === "image" && logo.object && logoObject

	const backdropObject = backdrop.type === "image" && backdrop.object ? backdrop.object : undefined
	const hasBackdrop = backdrop.type === "image" && backdrop.object && backdropObject

	// Logo States & Handler
	const logoInputRef = useRef<HTMLInputElement>(null)

	const [logoPreview, setLogoPreview] = useState<string | null>(
		`${directusURL}/assets/${logoObject?.filename_disk}`
	)
	const [isLogoPreviewing, setLogoPreviewing] = useState(false)
	const [clearLogo, setClearLogo] = useState(false)

	const handleLogoPreview = (e: ChangeEvent<HTMLInputElement>) => {
		setClearLogo(false)
		setLogoPreviewing(true)
		setLogoPreview(URL.createObjectURL(e.currentTarget.files?.[0] as Blob))
	}

	const handleLogoDelete = () => {
		setLogoPreviewing(false)
		setClearLogo(true)
		setLogoPreview(null)
	}

	// Backdrop States & Handler
	const backdropInputRef = useRef<HTMLInputElement>(null)

	const [backdropPreview, setBackdropPreview] = useState<string | null>(
		`${directusURL}/assets/${backdropObject?.filename_disk}`
	)
	const [isBackdropPreviewing, setBackdropPreviewing] = useState(false)
	const [clearBackdrop, setClearBackdrop] = useState(false)

	const handleBackdropPreview = (e: ChangeEvent<HTMLInputElement>) => {
		setClearBackdrop(false)
		setBackdropPreviewing(true)
		setBackdropPreview(URL.createObjectURL(e.currentTarget.files?.[0] as Blob))
	}

	const handleBackdropDelete = () => {
		setBackdropPreviewing(false)
		setClearBackdrop(true)
		setBackdropPreview(null)
	}

	useEffect(() => {
		setClearLogo(false)
		setClearBackdrop(false)
		setLogoPreviewing(false)
		setBackdropPreviewing(false)
	}, [])


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
			{(hasLogo || (!hasLogo && isLogoPreviewing)) && logoPreview !== null ?
				<div className={clsx(
					"absolute",
					"left-1/2",
					"top-1/2",
					"-translate-1/2",
				)
				}>
					<Image
						src={logoPreview}
						alt={logoObject?.description || ""}
						width={logoObject?.width || "320"}
						height={logoObject?.height || "240"}
						className={clsx(
							"w-auto",
							"h-12",
							"md:h-30",
							"object-contain",
							"drop-shadow-black/50",
							"drop-shadow-sm",
						)}
						loading="eager"
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
						onClick={(e) => handleLogoDelete()}
					>
						<Icon name="xmark" className={clsx(
							"size-3",
							"text-white",
						)} />
					</button>
				</div>
				:
				<div className={clsx(
					"w-48",
					"h-12",
					"md:h-30",
					"absolute",
					"left-1/2",
					"top-1/2",
					"-translate-1/2",
					(hasBackdrop || (!hasBackdrop && isBackdropPreviewing)) && backdropPreview !== null ? [
						"text-white",
						"bg-black/50",
						"dark:text-black",
						"dark:bg-white/50",
						// "backdrop-blur-sm",
						// "backdrop-saturate-0",
					] : [
						"text-neutral-500",
						"bg-black/5",
						"dark:bg-white/15",],
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
				((hasBackdrop || (!hasBackdrop && isBackdropPreviewing)) && backdropPreview !== null) ? [
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
					backgroundImage: ((hasBackdrop || (!hasBackdrop && isBackdropPreviewing)) && backdropPreview !== null) ?
						`url(${backdropPreview})`
						: undefined
				}}
			>
				{!((hasBackdrop || (!hasBackdrop && isBackdropPreviewing)) && backdropPreview !== null) &&
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
				}
				{(hasBackdrop || (!hasBackdrop && isBackdropPreviewing)) && backdropPreview !== null &&
					<button type="button" className={clsx(
						"cursor-pointer",
						"active:translate-px",
						"absolute",
						"-top-1.5",
						"-right-1.5",
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

						onClick={(e) => handleBackdropDelete()}
					>
						<Icon name="xmark" className={clsx(
							"size-3",
							"text-white",
						)} />
					</button>
				}
			</div>


		</div>
		<div className={clsx(
			"p-4",
		)}>
			<div className={clsx(
				"grid",
				"grid-cols-2",
				"gap-x-8",
				"pb-4",
			)}>
				<Field className={clsx(
				)}>
					<Label className={clsx(
						"sr-only",
					)}>Logo</Label>

					<SmallComicButton
						onClick={() => logoInputRef.current?.click()}
						className={clsx(
							"text-base",
							"w-full",
							"justify-center",
							"mb-3",
						)}
					>
						Change Logo
					</SmallComicButton>
					<input type="file"
						id={fieldset && fieldset[logoFieldName].name}
						name={fieldset && fieldset[logoFieldName].name}
						key={fieldset && fieldset[logoFieldName].key}
						ref={logoInputRef}
						className={clsx(
							"hidden",
							"mb-0",
							"font-platform-labels",
							"w-full"
						)}
						onChange={(e) => handleLogoPreview(e)}
					/>

					<ErrorMessage>{fieldset?.[logoFieldName].errors}</ErrorMessage>
					<Description>Logo Recommendations:<br />
						- Landscape aspect ratio (max 3:1)<br />
						- Transparency<br />
						- Solid colour stroke<br />
						- JPEG | PNG | GIF | WEBP
						- 1MB max
					</Description>
				</Field>
				{clearLogo &&
					<>
						<input type="hidden"
							name={logoClearFieldName}
							value="true"
						/>
						<input type="hidden"
							name={logoIDName}
							defaultValue={logoObject?.id}
						/>
					</>
				}
				<Field>
					<Label className={clsx(
						"sr-only",
					)}>Banner</Label>


					<SmallComicButton
						onClick={() => backdropInputRef.current?.click()}
						className={clsx(
							"text-base",
							"w-full",
							"justify-center",
							"mb-3",
							"px-6",
						)}
					>
						Change Backdrop
					</SmallComicButton>

					<input type="file"
						id={fieldset && fieldset[backdropFieldName].name}
						name={fieldset && fieldset[backdropFieldName].name}
						key={fieldset && fieldset[backdropFieldName].key}
						ref={backdropInputRef}
						// defaultValue={hasBackdrop ? backdropObject.filename_disk : ""}
						className={clsx(
							"hidden",
							"mb-0",
							"font-platform-labels",
							"w-full"
						)}
						onChange={(e) => handleBackdropPreview(e)}
					/>
					<ErrorMessage>{fieldset?.[backdropFieldName].errors}</ErrorMessage>
					<Description>Backdrop Recommendations:<br />
						- 1600x400px (4:1 aspect ratio)<br />
						- JPEG | PNG | GIF | WEBP
						- 1MB max
					</Description>
				</Field>
				{clearBackdrop &&
					<>

						<input type="hidden"
							name={backdropClearFieldName}
							value="true"
						/>
						<input type="hidden"
							name={backdropIDName}
							defaultValue={backdropObject?.id}
						/>
					</>
				}
			</div>
		</div>
	</Fieldset>
}