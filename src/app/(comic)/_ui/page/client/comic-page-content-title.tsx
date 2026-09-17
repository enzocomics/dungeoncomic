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
	pageSubmitText,
}: {
	pagePanels: Awaited<ReturnType<typeof getComicPage>>["comic_panels"]
	pageTitle?: string
	pageSubmitText?: string
}) {
	const t = useTranslations("ComicPage")
	const varsExist = doVarsExist(pagePanels)
	const varsSubmitted = haveVarsBeenSubmitted(pagePanels)

	const title = varsExist && varsSubmitted
		? pageSubmitText || `${t("next")}`
		: pageTitle

	return <h1
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
}