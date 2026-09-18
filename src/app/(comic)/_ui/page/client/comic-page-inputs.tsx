"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import React, { ComponentPropsWithoutRef, ComponentPropsWithRef, forwardRef, HTMLElementType, Ref, useActionState, useEffect, useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Form from "next/form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import { detailedDate, relativeDate } from "@/lib/dayjs"
// VALIDATION
import z from "zod"
import { parseWithZod } from "@conform-to/zod/v4"
import { useForm } from "@conform-to/react"
import { userSuggestionSchema } from "@/lib/zod/schemas/comic"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { replaceComicVariables } from "@/app/(comic)/_functions/parse-content"
// ACTIONS
import { saveUserVars } from "@/app/(comic)/_actions/variables"
import { deleteUserPlotSuggestion, PlotSuggestionType, submitUserPlotSuggestion, voteOnPlotSuggestion } from "@/app/(comic)/_actions/plot-suggestions"
// HELPERS

import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
// UI
import * as Headless from "@headlessui/react"
import { Button, Combobox, ComboboxInput, ComboboxButton, ComboboxOption, ComboboxOptions, Field, Fieldset, Label, Legend, Radio, RadioGroup, Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import { useComicContext } from "../../context"
import StatusMessage, { useChangeStatus } from "@/components/status-message"
import { ErrorMessage } from "@/components/forms"
import Link from "next/link"
import Icon from "@/styles/icons"
import { Textarea } from "@/components/textarea"
import { ComicButton } from "@/components/button"
import { AuthLink } from "@/components/auth"
import { ComicPageUIProps } from "../comic"


export function ComicErrorMessage({
	className,
	...props
}: { className?: string } & Omit<Headless.DescriptionProps, 'as' | 'className'>) {
	return <ErrorMessage
		{...props}
		className={clsx(
			className,
			"pt-3",
			"pb-2",
			"px-4",
			// Appearance
			"outline-2",
			"outline-red-100",
			"-outline-offset-2",
			"bg-red-100",
			"rounded-sm",
			"dark:outline-none",
			"dark:bg-black/10",
			// Text
			"text-xs",
			"text-red-600",
			"dark:text-white",
		)}>
		{props.children}
	</ErrorMessage>
}

export function ComicInputSection({
	className,
	...props
}: ComponentPropsWithoutRef<"section">) {
	return <section
		{...props}
		className={
			clsx(
				className,
				// Structure
				"flex",
				"flex-col",
				"gap-y-2",
				// Spacing
				"px-2",
				"md:px-6",
				// Size
				"w-full",
				"mx-auto",
				"max-w-2xl",
			)
		}
	>
		{props.children}
	</section>
}

export function ComicInputSectionRow({
	as: Tag = "div",
	...props
}: {
	as?: import("react").ElementType
} & ComponentPropsWithoutRef<import("react").ElementType>) {
	return <Tag
		{...props}
		className={
			clsx(
				props.className,
				"p-4",
				"rounded",
				"bg-neutral-100",
				"dark:bg-neutral-800/50"
			)
		}
	>
		{props.children}
	</Tag>
}

export const ComicInputRadio = forwardRef<HTMLSpanElement, Headless.RadioProps>(({
	className,
	...props
}, ref) => {
	return <Radio
		{...props}
		ref={ref}
		className={clsx(
			className,
			"cursor-pointer",
			"data-disabled:cursor-not-allowed",
			// Structure & Position
			"group",
			"relative",
			"flex",
			"gap-x-2",
			"items-center",
			// Size & Spacing
			"w-full",
			"p-4",
			// Text
			"font-comic-copy",
			"text-base",
			// Appearance
			"rounded",
			"bg-base-1",
			"dark:bg-base-1/25",
			"opacity-60",
			"data-checked:opacity-100",
			"hover:duration-0",
			"hover:opacity-90",
			"active:translate-px",
			// Transition
			"transition-all",
			"ease-in-out",
			"duration-300",
			"dark:data-checked:bg-comic-accent-800/60",
			"dark:hover:data-checked:bg-comic-accent-800",
			// Outline
			"outline-transparent",
			"focus:outline-4",
			"focus:-outline-offset-4",
			"focus:outline-comic-accent-500",
			"focus-within:outline-4",
			"focus-within:-outline-offset-4",
			"focus-within:outline-comic-accent-500",
			"data-disabled:outline-none",
		)}
	>
		<>
			<div className={
				clsx(
					"shrink-0",
					"relative",
					"size-5",
				)
			}>
				<Icon name="circle"
					className={
						clsx(
							"text-neutral-200",
							"size-5",
							"dark:group-data-checked:text-comic-accent-800",

						)
					}
				/>
				<Icon name="circleCheck"
					className={
						clsx(
							"absolute",
							"left-0",
							"top-1/2",
							"-translate-y-1/2",
							"text-neutral-200",
							"size-5",
							"opacity-0",
							"scale-50",
							"group-data-checked:scale-100",
							"group-data-checked:opacity-100",
							"group-data-checked:text-comic-accent-500",
							// Transition
							"transition-all",
							"ease-in-out",
							"duration-300",
							"dark:group-data-checked:text-white"
						)
					}
				/>
			</div>
			{props.children}
		</>
	</Radio>
})