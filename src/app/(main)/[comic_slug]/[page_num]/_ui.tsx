"use client"
/**----------------------------------- */
import { use } from "react"

export default function ComicPageUI({
	params
}: {
	params: { comic_slug: string, page_num: number }
}) {
	// const { comic_slug, page_num } = use(params)
	return <>
		get the params in page: <br />
		`comic_slug`: {params.comic_slug} <br />
		`page_num`: {params.page_num} <br />
		Comic Page
	</>
}