"use client"
/**----------------------------------- */
import clsx from "clsx"
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
// DATA
import { directusURL } from "@/data/env"
import { getComic, getComicPage } from "@/lib/directus/get-comics"
// UI
import { useChangeStatus } from "@/components/status-message"
import { Link } from "@/components/link"

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
	page
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
}) {
	const router = useRouter()
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-pink-300",
			"flex",
			"flex-col",
			"gap-4",
		)}>
			{page.title &&
				<h4 className={clsx(
					"text-3xl",
					"font-bold",
					"font-display",
				)}>
					{page.title ? page.title : ""}
				</h4>
			}
			{/* <p>{page.description}</p> */}
			{
				/**------------------------------
				 *	DISPLAY THE COMIC PANELS
				 */
			}
			{page.comic_panels ? page.comic_panels.map((p, index) =>
				<div key={index}>
					{p.panel_image &&
						<p><Image
							src={`${directusURL}/assets/${p.panel_image.filename_disk}.${p.panel_image.type}`}
							width={`${p.panel_image.width}`}
							height={`${p.panel_image.height}`}
							alt={`${p.panel_image.description}`}
							loading="eager"
						/></p>
					}
					{/* <p>{p.panel_title}</p> */}
					<p>{p.panel_description}</p>
				</div>
			) : null}

			<section className={clsx(
				"flex",
				"flex-row",
				"gap-1",
				"w-full"
			)}>
				{
					/**------------------------------
					 * PREV NAVIGATION
					 * - Instead of linking directly to the previous page,
					 *   we are going back 1 step in browser history
					 * - This is because pages can have multiple `prev_pages`
					 */
				}
				<div className={clsx("grow", "w-1/2")}>
					{page.prev_pages && page.prev_pages.length > 0 &&
						<>
							<h4 className={clsx(
								"font-semibold",
							)}>
								Previous Page(s)
							</h4>
							<div className={clsx(
								"p-2",
								"bg-amber-100",
								"text-xs"
							)}>
								{/* <button onClick={() => router.back()} >&laquo; Previous Page</button> */}
								<ul>
									{page.prev_pages.map((n, index) =>
										<li key={index}>
											<Link href={`${n.pages_id.comic_pagenum}`}>
												<strong>&laquo; Go back to page {n.pages_id.comic_pagenum}</strong>
												<span> ∙ </span>
												<span>Branch title: </span>
												<span>{n.branch_title}</span>
											</Link>
										</li>
									)}
								</ul>
							</div>
						</>
					}
				</div>
				{
					/**------------------------------
					 *	NEXT NAVIGATION
					 */
				}
				<div className={clsx("grow", "w-1/2")}>
					{page.next_pages && page.next_pages.length > 0 &&
						<>
							<h4 className={clsx(
								"font-semibold",
							)}>
								Next Page(s)
							</h4>
							<ul className={clsx(
								"p-2",
								"bg-amber-100",
								"text-xs"
							)}>
								{page.next_pages.map((n, index) =>
									<li key={index}>
										<Link href={`${n.linked_pages_id.comic_pagenum}`}>
											<strong>Go forward to page {n.linked_pages_id.comic_pagenum} </strong>
											<span> ∙ </span>
											<span>Branch title: </span>
											<em>{n.branch_title} </em>
											<span>&raquo;</span>
											<p>{n.branch_description}</p>
										</Link>
									</li>
								)}
							</ul>
						</>
					}
				</div>
			</section>
			{
				/**------------------------------
				 *	Page Meta
				 */
			}
			<section>
				<h4 className={clsx(
					"font-semibold"
				)}>Page Metadata</h4>
				<ul className={clsx(
					"p-2",
					"bg-amber-100",
					"text-xs"
				)}>
					<li><strong>Created by</strong> @{page.user_created.username ? page.user_created.username : ""} on {page.date_created}</li>
					{page.user_updated &&
						<li><strong>Last updated by</strong> @{page.user_updated.username} on {page.date_updated}</li>
					}
				</ul>
			</section>
		</div >
	</>
}