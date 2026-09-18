"use client"
/**----------------------------------- */
import clsx from "clsx"
import { useTranslations } from "next-intl"
import { doVarsExist, haveVarsBeenSubmitted } from "@/app/(comic)/_functions/check-vars"
import { getComicPage, getComicVariables } from "@/lib/directus/get-comics"

/**
 * Conditionally fetch the comic page title or the post-variable-submit-form title
 * 
 */
export function ClientComicPageContentTitle({
	pagePanels,
	pageTitle,
	pageSubtitle,
	pageSubmitText,
}: {
	pagePanels: Awaited<ReturnType<typeof getComicPage>>["comic_panels"]
	pageTitle: string
	pageSubtitle?: string
	pageSubmitText?: string
}) {
	const t = useTranslations("ComicPage")
	const varsExist = doVarsExist(pagePanels)
	const varsSubmitted = haveVarsBeenSubmitted(pagePanels)

	const title = varsExist && varsSubmitted
		? pageSubmitText || `${t("next")}`
		: pageTitle

	const subtitle = !varsSubmitted && pageSubtitle

	return <section>
		<h1
			className={clsx(
				"px-6",
				"lg:pt-6",
				"max-w-prose",
				"mx-auto",
				"font-bold",
				"font-comic-display",
				"text-3xl",
				"lg:text-4xl",
				"text-center",
			)}
			dangerouslySetInnerHTML={{
				__html: title as string
			}}
		/>
		{subtitle &&
			<h2
				className={clsx(
					"mt-2",
					"px-6",
					"max-w-prose",
					"mx-auto",
					"italic",
					"font-normal",
					"font-comic-display",
					"text-lg",
					"lg:text-xl",
					"text-center",
				)}
				dangerouslySetInnerHTML={{
					__html: subtitle as string
				}}
			/>
		}
	</section>
}