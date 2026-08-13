"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
/**----------------------------------- */
export default function ComicPageUI({
	params,
	page
}: {
	params: { comic_slug: string, page_num: number }
	page: object
}) {
	// Get Pages
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