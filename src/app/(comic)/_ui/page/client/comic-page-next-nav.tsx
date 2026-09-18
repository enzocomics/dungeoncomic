"use client"
/**----------------------------------- */
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
import { getComicPage, getComicVariables } from "@/lib/directus/get-comics"
import { checkHasNextPage } from "@/app/(comic)/_functions/check-pages"
import Icon from "@/styles/icons"
import { ComicButton } from "@/components/button"

/**
 * Display the button to go to the next page.
 * - Doesn't display if a variable form exists that hasn't been submitted
 */
export function ClientComicPageNextNav({
	page,
	nextPageTitles,
	nextPageSubtitles,
}: {
	page: Awaited<ReturnType<typeof getComicPage>>
	nextPageTitles?: string[]
	nextPageSubtitles?: string[]
}) {
	const t = useTranslations("ComicPage")
	const varsExist = doVarsExist(page.comic_panels)
	const varsSubmitted = haveVarsBeenSubmitted(page.comic_panels)
	const hasNextPage = checkHasNextPage(page.next_pages)

	return <section className={clsx(
		"flex",
		"flex-col",
		"gap-y-6",
	)}>
		{(!varsExist || (varsExist && varsSubmitted)) &&
			<div className={clsx(
				"flex",
				"flex-col",
				"gap-y-2",
				"px-6",
				"w-full",
				"mx-auto",
				"max-w-2xl",
			)}>
				{hasNextPage &&
					<>
						<ul className={clsx(
							"flex",
							"flex-col",
							"gap-2",
							"text-center",
						)}>
							{nextPageTitles && page?.next_pages?.map((n, index) =>
								<li key={index} className={clsx(
								)}>
									<ComicButton visited={true} as="link"
										href={`./${n.linked_pages_id.comic_pagenum}`}
									>
										<span className={clsx(
											"grow",
											"text-pretty",
										)}>
											<span>
												{nextPageTitles[index]}
											</span>
											<br />
											{n.linked_pages_id.subtitle &&
												// <p>{
												// 	replaceComicVariables({
												// 		content: sanitize(n.linked_pages_id.subtitle),
												// 		variables: variables,
												// 		userVariables: userVariables
												// 	})
												// }</p>
												<></>
											}
										</span>
										<Icon name="play" className={clsx(
											"ml-1",
											"size-4",
										)} />
									</ComicButton>
								</li>
							)}
						</ul>
					</>
				}
			</div>
		}
	</section>
}