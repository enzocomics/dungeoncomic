"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
// DATA
import { getComic, getComicPage } from "@/lib/directus/get-comics"
// UI
import { useChangeStatus } from "@/components/status-message"

/**-----------------------------------
 * HOMEPAGE PAGE UI
 * ---
 */
export function HomepagePageUI() {
	// STATUS MESSAGE
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")

	// Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "logged-out":
				setStatus("info", s("logged-out"))
				break
		}
	}, [urlStatus])


	return <>
		<div className={clsx(
			// Temporary CSS
			"p-4",
			"border",
			"border-blue-700",
			"border-dashed",
		)}>
			This is the homepage
		</div>
	</>
}

/**-----------------------------------
 * Comic Landing Page UI
 * ---
 */
export function ComicLandingPageUI({
	comic
}: {
	comic: Awaited<ReturnType<typeof getComic>>
}) {
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-yellow-500",
		)}>
			This is the Comic Landing Page
		</div>
	</>
}

/**-----------------------------------
 * Comic Page UI
 * ---
 */
export default function ComicPageUI({
	// params,
	page
}: {
	// params: { comic_slug: string, page_num: number }
	page: Awaited<ReturnType<typeof getComicPage>>
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
			{/* `comic_slug`: {params.comic_slug} <br />
			`page_num`: {params.page_num} <br /> */}
			Comic Page
		</div>
	</>
}