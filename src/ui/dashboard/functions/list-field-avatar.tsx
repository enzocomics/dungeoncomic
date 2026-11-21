"use client"

import { SmallComicButton } from "@/components/input/button"
import { Description, Field } from "@/components/input/fieldset"
import Icon from "@/styles/icons"
import clsx from "clsx"
import { marked } from "marked"

export default function SingleAvatarField() {
	return <Field className={clsx(
		"md:col-span-2",

	)}>
		<div className={clsx(
			"flex",
			"flex-row",
			"gap-4"
		)}>
			<div className={clsx(
				"w-32",
				"h-32",
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
			<div className={clsx(
				"grid",
				"place-content-center"
			)}>
				<SmallComicButton
					// onClick={() => logoInputRef.current?.click()}
					className={clsx(
						"text-base",
						"w-64",
						"justify-center",
						"mb-3",
					)}
				>
					Change Avatar
				</SmallComicButton>
				<Description dangerouslySetInnerHTML={{
					__html: marked.parse(
						"Image Requirements:\n" +
						"- JPEG | PNG | GIF | WEBP\n" +
						"- 1MB max"
					)
				}} />
			</div>
		</div>
	</Field>
}