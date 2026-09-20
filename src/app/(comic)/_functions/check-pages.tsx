import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { haveVarsBeenSubmitted } from "./check-vars"

/**----------------------------------- */
export const checkCoverPage = (
	landingPage: Awaited<ReturnType<typeof getComic>>["landing_page"]
) => {
	return !!(landingPage === "cover-page")
}

export const checkHasPrevPage = (
	prevPages: Awaited<ReturnType<typeof getComicPage>>["prev_pages"],
	panels: Awaited<ReturnType<typeof getComicPage>>["comic_panels"]
) => {
	const varsSubmitted = haveVarsBeenSubmitted(panels)
	return !!(
		prevPages &&
		prevPages.length > 0 &&
		prevPages.some(
			// checks that at least ONE page is published
			p => p.pages_id.status === "published"
		)
	) || varsSubmitted
}

export const checkHasNextPage = (
	nextPages: Awaited<ReturnType<typeof getComicPage>>["next_pages"]
) => {
	return !!(
		nextPages &&
		nextPages.length > 0 &&
		nextPages.some(
			// checks that at least ONE page is published
			p => p.linked_pages_id.status === "published"
		)
	)
}

export const checkHasPlotSuggestions = (
	plotSuggestions: Awaited<ReturnType<typeof getComicPage>>["plot_suggestions"]
) => {
	return !!(
		plotSuggestions &&
		plotSuggestions.length > 0
	)
}