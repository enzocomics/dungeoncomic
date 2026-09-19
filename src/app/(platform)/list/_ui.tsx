import { directusURL } from "@/data/env"
import { getComics } from "@/lib/directus/get-comics"
import { TailwindColors } from "@/lib/directus/schema"
import { sanitize } from "@/lib/sanitize"
import { colorVariants } from "@/styles/colors"
import { displayFonts } from "@/styles/fonts"
import Icon from "@/styles/icons"
import clsx from "clsx"
import { marked } from "marked"
import Image from "next/image"
import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"


export const ListPageTitle = (

) => (
	<div className={clsx(
		"w-full",
		"px-6",
		"mx-auto",
		"font-normal",
		"font-platform-header",
		"text-xl",
		"text-center",
		"md:text-left",
	)}>
		Viewing: <strong>All Comics</strong>
	</div>
)

export const ListPageList = (
	props: ComponentPropsWithoutRef<"ul">
) => (
	<div
		className={clsx(
			"px-6",
			"gap-2",
			"grid",
			"grid-cols-1",
			"sm:grid-cols-2",
			"lg:grid-cols-3",
		)}>
		{props.children}
	</div>
)

export const ListPageItem = ({
	accentColor,
	banner,
	title,
	...props
}: {
	accentColor: TailwindColors | null
	banner: Awaited<ReturnType<typeof getComics>>[number]["banner"]
	title: Awaited<ReturnType<typeof getComics>>[number]["title"]
} & ComponentPropsWithoutRef<typeof Link>) => (
	<Link
		{...props}
		aria-label={title}
		style={{
			"--color-comic-accent-100": accentColor ? `var(${colorVariants[accentColor]["100"]})` : undefined,
			"--color-comic-accent-200": accentColor ? `var(${colorVariants[accentColor]["200"]})` : undefined,
			"--color-comic-accent-300": accentColor ? `var(${colorVariants[accentColor]["300"]})` : undefined,
			"--color-comic-accent-400": accentColor ? `var(${colorVariants[accentColor]["400"]})` : undefined,
			"--color-comic-accent-500": accentColor ? `var(${colorVariants[accentColor]["500"]})` : undefined,
			"--color-comic-accent-600": accentColor ? `var(${colorVariants[accentColor]["600"]})` : undefined,
			"--color-comic-accent-700": accentColor ? `var(${colorVariants[accentColor]["700"]})` : undefined,
			"--color-comic-accent-800": accentColor ? `var(${colorVariants[accentColor]["800"]})` : undefined,
			"--color-comic-accent-900": accentColor ? `var(${colorVariants[accentColor]["900"]})` : undefined,
			backgroundImage: banner ? `url(${directusURL}/assets/${banner?.filename_disk})` : undefined
		} as React.CSSProperties}
		className={clsx(
			"group",
			"flex",
			"justify-center",
			"items-center",
			"h-30",
			"p-2",
			// Appearance
			banner ? [
				"dark:bg-comic-accent-800",
			] : [
				"bg-base-2/20",
				"dark:bg-base-3/50",
			],
			"grayscale-100",
			"hover:grayscale-0",
			"focus:grayscale-0",
			"rounded",
			"bg-cover",
			"bg-center",
			"overflow-hidden",
			"hover:opacity-75",
			"hover:duration-0",
			"active:translate-px",
			"focus:outline-4",
			"focus:-outline-offset-4",
			"focus:outline-comic-accent-500",
			// Transition
			"transition-all",
			"ease-in-out",
			"duration-300",

		)}
	>
		{props.children}
	</Link>
)

export const ListPageItemLogo = ({
	comic
}: {
	comic: Awaited<ReturnType<typeof getComics>>[number]
}) => {

	const comicDisplayFont = displayFonts[comic.display_font.toString()].slug

	const comicTitle = sanitize(comic.title)
	const shortTitle = !!(comicTitle.length < 25)
	const mediumTitle = !!(comicTitle.length >= 25 && comicTitle.length < 65)
	const longTitle = !!(comicTitle.length >= 65)
	const hasLogo = !!comic.logo
	const hasBanner = !!comic.banner

	return comic.logo ? (
		<>
			<Image
				src={`${directusURL}/assets/${comic.logo?.filename_disk}`}
				width={comic.logo.width || "320"}
				height={comic.logo.height || "320"}
				alt={comic.logo.description || comic.title}
				className={clsx(
					"p-2",
					"h-full",
					"w-auto",
					"max-h-30",
					"object-contain"
				)}
			/>
		</>
	) : (
		<span
			style={{
				fontFamily: `var(--font-${comicDisplayFont})`
			}}
			className={clsx(

				"w-full",
				"overflow-hidden",
				"text-center",
				"text-pretty",
				shortTitle && "text-4xl",
				mediumTitle && "text-2xl",
				longTitle && "text-base",
				"group-active:text-comic-accent-500"
			)}
		>
			{comicTitle}
		</span>
	)
}


export const ListPageItemThumb = ({
	thumbnail,
}: {
	thumbnail: Awaited<ReturnType<typeof getComics>>[number]["thumbnail"]
}) => (
	<div className={clsx(
		// STructure
		// "sm:row-span-2",
		// Appearance
		"bg-base-2/20",
		"dark:bg-base-3/50",
		"p-2",
		"flex",
		"items-center",
	)}>
		{thumbnail ? (
			<Image
				src={`${directusURL}/assets/${thumbnail?.filename_disk}`}
				width={thumbnail.width || "320"}
				height={thumbnail.height || "320"}
				alt={thumbnail.description || ""}
				className={clsx(
					"aspect-square",
					"w-full",
				)}
			/>
		) : (
			<Icon name="skull" className={clsx(
				"aspect-square",
				"w-full",

				// "p-15",
				"text-neutral-300",
				"bg-neutral-100",
			)} />
		)
		}
	</div>
)

export const ListPageItemDetails = (
	props: ComponentPropsWithoutRef<"div">) => (
	<div
		className={clsx(
			"p-4",
		)}
	>
		{props.children}
	</div>
)

export const ListPageItemTitle = ({
	title,
	...props
}: {
	title: Awaited<ReturnType<typeof getComics>>[number]["title"]
} & ComponentPropsWithoutRef<"div">) => {
	const cleanTitle = sanitize(title)
	return <span
		{...props}
		className={clsx(
			// Structure
			"flex",
			"items-center",
			// Appearance
			"p-2",
			"bg-base-2/20",
			"dark:bg-base-3/50",
			// Text
			"font-platform-header",
			"font-semibold",
			"text-lg",
		)}
	>
		{cleanTitle}
	</span>
}


export const ListPageItemDescription = async ({
	description
}: {
	description: Awaited<ReturnType<typeof getComics>>[number]["description"]
}) => {
	const parseDescription = await marked.parse(sanitize(description))
	const cleanDescription = sanitize(parseDescription,
		{
			ALLOWED_TAGS: ["strong", "b", "em", "i", "del", "s", "u", "br", "a"],
			ALLOWED_ATTR: ["href", "target", "rel", "title"],
		})

	return <div
		dangerouslySetInnerHTML={{
			__html: cleanDescription
		}}
		className={clsx(
			// Structure
			"col-span-2",
			"sm:col-span-1",
			"sm:col-start-2",
			"sm:row-start-2",
			// 
			"p-4",
			// Text
			"text-base/relaxed",
			"font-platform-copy",
		)}
	/>
}