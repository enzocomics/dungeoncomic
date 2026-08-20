import clsx from "clsx"

import { Suspense } from "react"
import { Link } from "@/components/link"

export async function FrontpageLayoutUI({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			// Temporary CSS
			"border",
			"border-red-600",
			"border-dashed",
			"p-4"
		)}>
			<h2 className={clsx(
				// Temporary CSS
				"text-4xl",
				"font-bold",
				"font-display"
			)}>
				Root Layout
			</h2>
			Navigation:&nbsp;&nbsp;
			<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic/1">Comic Page 1</Link>
			<Suspense>
				{children}
			</Suspense>
		</div>
	</>
}

export async function ComicLayoutUI({
	children,
	comic_slug
}: {
	children: React.ReactNode
	comic_slug?: string
}) {
	return <div className={clsx(
		// Temporary CSS
		"p-4",
		"border",
		"border-orange-500",
		"border-dashed",
	)}>
		<h3 className={clsx(
			// Temporary CSS
			"font-display",
			"text-2xl",
		)}>Comic Layout</h3>
		<strong>get the `comic_slug` in layout</strong>: {comic_slug} <br />
		{children}
	</div>
}