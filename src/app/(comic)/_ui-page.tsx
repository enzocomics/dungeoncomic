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
	console.log(page.plot_suggestions)
	return <>
		<div className={clsx(
			"p-4",
			"border",
			"border-dashed",
			"border-pink-300",
			"flex",
			"flex-col",
			"gap-2",
		)}>
			{page.title &&
				<h4 className={clsx(
					"text-3xl",
					"font-bold",
					"font-display",
					"text-center"
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
					<div className={clsx(
						"mt-4",
						"prose"
					)}>
						{p.panel_description}
					</div>
				</div>
			) : null}
			{
				/**------------------------------
				 * FEEDBACK
				 * -
				 */
			}
			{page.plot_prompt &&
				<div className={clsx(
					"bg-pink-100",
					"p-4",
					"mt-8",
				)}>
					<h4 className={
						clsx(
							"text-2xl",
							"font-semibold",
							"text-center",
							"mb-2"
						)
					}>
						{page.plot_prompt}
					</h4>
					<ul className={clsx(

					)}>
						{page.plot_suggestions.map((s, index) => (
							<li key={index} className={clsx(
								"text-center"
							)}>
								{s.title} - {s.votes || 0}
							</li>
						))}
					</ul>
				</div>
			}
			{
				/**------------------------------
				 * NAVIGATION BLOCK
				 * -
				 */
			}
			<section className={clsx(
				"mt-8",

				"gap-1",
				"w-full"
			)}>
				{
					/**------------------------------
					 *	NEXT NAVIGATION
					 */
				}
				<div className={clsx(
					"mx-auto",
					"w-2/3"
				)}>
					{page.next_pages && page.next_pages.length > 0 &&
						<>
							<h4 className={clsx(
								"font-semibold",
								"text-center"
							)}>
								Next Page(s)
							</h4>
							<ul className={clsx(
								"flex",
								"flex-col",
								"gap-2",
								"p-2",
								"bg-amber-100",
								"text-xs"
							)}>
								{page.next_pages.map((n, index) =>
									<li key={index} className={clsx(
									)}>
										<Link className={clsx(
											"block",
											"p-2",
											"hover:bg-black/10",
										)} href={`${n.linked_pages_id.comic_pagenum}`}>
											<strong>{n.linked_pages_id.title} &raquo;</strong><br />
											{n.linked_pages_id.subtitle &&
												<p>{n.linked_pages_id.subtitle}</p>
											}
										</Link>
									</li>
								)}
							</ul>
						</>
					}
				</div>

				{
					/**------------------------------
					 * PREV NAVIGATION
					 * - Instead of linking directly to the previous page,
					 *   we are going back 1 step in browser history
					 * - This is because pages can have multiple `prev_pages`
					 */
				}
				<div className={clsx(
					"basis-full",
				)}>
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
								<ul className={clsx(
									"flex",
									"flex-col",
									"gap-2",
								)}>
									<li>
										<Link className={clsx(
											"block",
											"p-2",
											"hover:bg-black/10",
										)} href="/1">Start Over</Link>
									</li>
									{page.prev_pages.map((n, index) =>
										<li key={index}>
											<Link className={clsx(
												"block",
												"p-2",
												"hover:bg-black/10",
											)} href={`${n.pages_id.comic_pagenum}`}>
												{/* <strong>&laquo; Return to page {n.pages_id.comic_pagenum}<br /></strong> */}
												<strong>&laquo; {n.pages_id.title}</strong>
											</Link>
										</li>
									)}
								</ul>
							</div>
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
		</div>
	</>
}