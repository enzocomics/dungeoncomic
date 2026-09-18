import clsx from "clsx"
import Image from "next/image"
import { ComponentPropsWithoutRef } from "react"

export const LandingPageWrapper = ({
	className,
	...props
}: ComponentPropsWithoutRef<"div">) => {
	return <div
		{...props}
		className={clsx(
			className,
			"relative",
		)}
	>
		{props.children}
	</div>
}

export const LandingPageHeader = (
	props: ComponentPropsWithoutRef<"header">
) => {
	return <header
		className={clsx(
			"flex",
			"items-center",
			"justify-center",
		)}
	>
		{props.children}
	</header>
}

export const LandingPageLogo = (
	props: ComponentPropsWithoutRef<typeof Image>
) => (
	<Image
		{...props}
		className={clsx(
			"drop-shadow-black/50",
			"drop-shadow-lg",
			"max-h-60",
			"my-20",
			"box-content",
		)}
	/>
)

export const LandingPageH1 = (
	props: ComponentPropsWithoutRef<"h1">
) => (
	<h1
		{...props}
		className={clsx(
			props.className,
			"flex",
			"items-center",
			"min-h-48",
			"px-6",
			"py-6",
			"font-comic-display",
			"text-5xl/tight",
			"text-center",
			"text-pretty",
			"font-bold",
			"max-w-2xl",
			"rounded",
		)}
	>
		{props.children}
	</h1>
)

export const LandingPageBody = ({
	className,
	...props
}: ComponentPropsWithoutRef<"article">) => {
	return <article
		{...props}
		className={clsx(
			className,
			// Structure
			"flex",
			"flex-col",
			"gap-6",
			// Spacing
			"pt-6",
			"pb-18",
			"sm:pt-12",
			"lg:pt-18",
			// Appearance
			"bg-base-1",
			"dark:bg-base-2",
			"dark:shadow-none",
			"dark:outline",
			"dark:-outline-offset-1",
			"dark:outline-base-5/50",
			"text-center",
			"md:rounded"
		)}
	>
		{props.children}
	</article>
}

export const LandingPageContent = ({
	content
}: {
	content?: string | null
}) => {
	return <div
		className={clsx(
			"landing-page-content",
			// "py-6",
			"prose",
			"text-base/loose",
			"lg:text-lg/loose",
			"text-left",
			"text-pretty",
		)}
		dangerouslySetInnerHTML={{
			__html: `${content}`
		}}
	/>
}