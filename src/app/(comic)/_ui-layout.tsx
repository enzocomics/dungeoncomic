"use client"
/**----------------------------------- */
// LIBRARIES
import { Suspense } from "react"
import { Link } from "@/components/link"
// FUNCTIONS
import clsx from "clsx"
// DATA
import { getComic } from "@/lib/directus/get-comics"

/**-----------------------------------
 * COMIC FRONTPAGE LAYOUT
 * ---
 * - Default homepage
 */
export function ComicLayoutUI({
	children,
	comic
}: {
	children: React.ReactNode
	comic: Awaited<ReturnType<typeof getComic>>
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
		)}>Comic Layout UI</h3>
		<strong>Comic Title</strong>: {comic.title} <br />
		<strong>Comic Description</strong>: {comic.description} <br />
		<br />
		{children}
	</div>
}

/**-----------------------------------
 * FRONTPAGE LAYOUT
 * ---
 * - 
 * 
 */
export function FrontpageLayoutUI({ children }: { children: React.ReactNode }) {
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