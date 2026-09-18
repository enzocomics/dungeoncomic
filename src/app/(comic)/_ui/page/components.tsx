import clsx from "clsx"
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

export const LandingPageHeader = ({
	className,
	...props
}: ComponentPropsWithoutRef<"header">) => {
	return <header
		{...props}
		className={clsx(
			className,
			"flex",
			"items-center",
			"justify-center",
		)}
	>
		{props.children}
	</header>
}

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
			__html: content || ""
		}}
	/>
}