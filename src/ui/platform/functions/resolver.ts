/**----------------------------------- */
// DATA
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"

// TYPES & HELPER FUNCTIONS
type PageAction = "edit" | "preview"

function isPageAction(value: unknown) {
	return value === "edit" || value === "preview"
}

type ComicAction = "settings"

function isComicAction(value: unknown) {
	return value === "settings"
}
/**----------------------------------- */
// RESOLVED ROUTE TYPES
export type ResolvedRoute =
	| {
			type: "platform-homepage"
	  }
	| {
			type: "comic-landing-page"
			postTypeSlug?: string
			comicSlug?: Awaited<ReturnType<typeof getComic>>["slug"]
	  }
	| {
			type: "comic-action"
			postTypeSlug?: string
			comicAction: ComicAction
	  }
	| {
			type: "comic-single-page"
			postTypeSlug?: string
			comicSlug?: Awaited<ReturnType<typeof getComic>>["slug"]
			pageNum: number
	  }
	| {
			type: "comic-single-page-action"
			postTypeSlug?: string
			comicSlug?: Awaited<ReturnType<typeof getComic>>["slug"]
			pageNum: number
			pageAction: PageAction
	  }
	| {
			type: "comic-named-page"
			postTypeSlug?: string
			comicSlug?: Awaited<ReturnType<typeof getComic>>["slug"]
			pageSlug: string
	  }

/**----------------------------------- */
export async function resolveRoute(
	segments: string[],
	routingMode: Awaited<ReturnType<typeof getSettings>>["routing_mode"],
): Promise<ResolvedRoute | null> {
	const settings = await getSettings()
	const frontpageComicSlug = settings.frontpage_comic?.slug

	// ROUTE RESOLVER
	switch (routingMode) {
		case "single/single": {
			const [pageNumOrComicAction, pageAction, invalid] = segments

			// Any routes deeper than pageAction are invalid
			if (invalid) return null

			// If no level 1 route is defined
			if (!pageNumOrComicAction)
				return {
					type: "comic-landing-page",
					comicSlug: frontpageComicSlug,
				}

			// If the level 1 route is a defined comic action
			if (isComicAction(pageNumOrComicAction))
				return {
					type: "comic-action",
					comicAction: pageNumOrComicAction,
				}

			// If the level 1 route is a number + no subroute
			if (/^\d+$/.test(pageNumOrComicAction) && !pageAction)
				return {
					type: "comic-single-page",
					comicSlug: frontpageComicSlug,
					pageNum: Number(pageNumOrComicAction),
				}

			// If the level 1 route is a number + valid pageAction subroute
			if (/^\d+$/.test(pageNumOrComicAction) && isPageAction(pageAction))
				return {
					type: "comic-single-page-action",
					comicSlug: frontpageComicSlug,
					pageNum: Number(pageNumOrComicAction),
					pageAction: pageAction,
				}
		}
		case "single/multiple": {
			const [comicSlug, pageNum] = segments
			return {
				type: "platform-homepage",
			}
		}
		case "multiple/multiple": {
		}
		default: {
			return null
		}
	}
}
