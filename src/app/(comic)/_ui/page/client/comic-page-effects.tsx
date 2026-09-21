"use client"
import { checkHasNextPage, checkHasPrevPage } from "@/app/(comic)/_functions/check-pages"
import { getComicPage } from "@/lib/directus/get-comics"
import { useComicContext } from "../../context"
import { useContext, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useChangeStatus } from "@/components/status-message"
import clsx from "clsx"
import { useGlobalContext } from "@/app/_context"

export default function ClientComicPageEffects({
	page,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
}) {

	const pathname = usePathname()
	const searchParams = useSearchParams()
	const setStatus = useChangeStatus("")
	const hasPrevPage = checkHasPrevPage(page.prev_pages, page.comic_panels)
	const hasNextPage = checkHasNextPage(page.next_pages)

	// Retrieve Context
	const {
		canGoBack, setCanGoBack,
		comicPreviousPage, setComicPreviousPage,
		comicPageHistory, setComicPageHistory
	} = useComicContext()

	useEffect(() => {
		//////////////////////////////////////////////////////////////////////
		// TODO: WIP: COMIC PAGE HISTORY
		// CURRENTLY NOT WORKING, LEAVING FOR NOW
		let isHistorySet = false

		if (
			!isHistorySet
			// && !varsSubmitted
			// && `${comicPreviousPage.pagenum}` !== comicPageHistory.at(-1)
		) {
			comicPreviousPage.pagenum !== undefined &&
				setComicPageHistory([...comicPageHistory, `${comicPreviousPage.pagenum}`])
			isHistorySet = true
		}
		//////////////////////////////////////////////////////////////////////

		let prevUrl
		let prevPageMatches
		// Get the PREVIOUS url, including anything with params
		if (comicPreviousPage.pagenum !== undefined) {
			prevUrl = comicPreviousPage.params !== undefined ?
				comicPreviousPage.pagenum + "?" + comicPreviousPage.params :
				comicPreviousPage.pagenum
			// outputs: `1?name=Steve&othervar=value` or just `1`

			// Check if the pagenum exists in the list of this page's "prevpages"
			prevPageMatches = hasPrevPage && page.prev_pages!.some(p =>
				p.pages_id?.comic_pagenum === comicPreviousPage.pagenum
			)

			// Allow the history back button only when the browser's previous page matches a page in the prevpages list
			setCanGoBack(prevPageMatches)
		}

		// Set the current page as the "previous page", this value will be used on the next page update (whenever pathname/searchparams is changed)
		setComicPreviousPage({
			pagenum: page.comic_pagenum,
			params: searchParams.toString() || undefined
		})

	}, [pathname, searchParams.toString()])

	return <>
		{/* DEBUG */}
		<span
			className={clsx(
				"hidden",
				"fixed",
				"w-full",
				"z-100",
				"bottom-0",
				"bg-green-900/50",
				"backdrop-blur-xl",
				"text-green-500",
				"p-4",
				"font-platform-mono",
			)}>
			<p><strong>prevpage in state:</strong> {comicPreviousPage.pagenum}</p>
			<p><strong>page history:</strong> {comicPageHistory.map(h => `${h}, `)}</p>
		</span>
	</>
}