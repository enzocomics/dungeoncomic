"use client"
import clsx from "clsx"
/**----------------------------------- */
import { use } from "react"

export default function ComicPageUI({
	params
}: {
	params: { comic_slug: string, page_num: number }
}) {
	// const { comic_slug, page_num } = use(params)
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-pink-300",
		)}>
			<h4 className={clsx(
				"font-bold"
			)}>
				Comic Single Page
			</h4>
			get the params in page: <br />
			`comic_slug`: {params.comic_slug} <br />
			`page_num`: {params.page_num} <br />
			Comic Page
		</div>
	</>
}