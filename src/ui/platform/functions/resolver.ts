/**----------------------------------- */
// DATA
import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"

// TYPES & HELPER FUNCTIONS
type PageAction = "edit" | "preview"

function isPageAction(value: unknown) {
	return value === "edit" || value === "preview"
}

// #TODO: in the future this should dynamically fetch any pages created by the user (i.e. archive, about, cast, etc)
type ComicNamedPage = "archive" | "settings"

function isComicNamedPage(value: unknown) {
	return value === "archive" || value === "settings"
}

/**----------------------------------- */
// RESOLVED ROUTE TYPES
export type ResolvedRoute =
	| {
			type: "platform-homepage"
	  }
	| {
			type: "platform-category-page"
			postTypeSlug?: string
	  }
	| {
			type: "comic-landing-page"
			postTypeSlug?: string
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
	  }
	| {
			type: "comic-named-page"
			postTypeSlug?: string
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
			pageSlug: ComicNamedPage
	  }
	| {
			type: "comic-single-page"
			postTypeSlug?: string
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
			pageNum: number
	  }
	| {
			type: "comic-single-page-action"
			postTypeSlug?: string
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
			pageNum: number
			pageAction: PageAction
	  }

/**----------------------------------- */
export async function resolveRoute(
	segments: string[],
	routingMode: Awaited<ReturnType<typeof getSettings>>["routing_mode"],
): Promise<ResolvedRoute | null> {
	const settings = await getSettings()
	// Comic slug is the selected frontpage comic, falling back to the first existing comic
	const comicSlug = settings.frontpage_comic?.slug || (await getComic({})).slug

	// ROUTE RESOLVER
	switch (routingMode) {
		case "single/single": {
			/**---------------------------------------------------------------------- */
			// Single Creator, Single Comic
			// - Comic lives at root: `dungeoncomic.com`
			// - Pages live at first-level route: `dungeoncomic.com/1`, `dungeoncomic.com/settings`

			// Structure:
			// - `root`:
			//       comic landing page,
			// - `root/[comicPageNumOrName]`:
			//       comic single/content page, comic action
			// - `root/[comicPageNumOrName]/[pageAction]`:
			//       comic single/content page edit/preview
			// - `root/[comicPageNumOrName]/[pageAction]/[invalid]`:
			//       404

			// Get the possible segments
			const [comicPageNumOrName, pageAction, invalid] = segments

			// Any routes deeper than pageAction are invalid
			if (invalid) return null

			/**----------------------------------- */
			// If no level 1 route is defined
			// - `dungeoncomic.com`
			if (!comicPageNumOrName) {
				const comic = await getComic({})
				if (comic)
					// If any comic exists, return the landing page
					return {
						type: "comic-landing-page",
						comicSlug: comicSlug,
					}
				else
					// fallback to platform homepage if no comic exists
					return { type: "platform-homepage" }
			}

			/**----------------------------------- */
			// If the level 1 route is NOT a number, and is a valid named page
			// - `dungeoncomic.com/archive`
			if (
				!/^\d+$/.test(comicPageNumOrName) &&
				isComicNamedPage(comicPageNumOrName)
			)
				return {
					type: "comic-named-page",
					comicSlug: comicSlug,
					pageSlug: comicPageNumOrName,
				}

			/**----------------------------------- */
			// If the level 1 route is a number + no subroute
			// - `dungeoncomic.com/1`
			if (/^\d+$/.test(comicPageNumOrName) && !pageAction)
				return {
					type: "comic-single-page",
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
				}

			/**----------------------------------- */
			// If the level 1 route is a number + valid pageAction subroute
			// - `dungeoncomic.com/1/edit`
			if (/^\d+$/.test(comicPageNumOrName) && isPageAction(pageAction))
				return {
					type: "comic-single-page-action",
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
					pageAction: pageAction,
				}

			/**----------------------------------- */
			// All other cases-- return nothing (404)
			return null
		}

		case "single/multiple": {
			/**---------------------------------------------------------------------- */
			// Single Creator, Multiple Comics
			// - Comics live at first-level route: `dungeoncomic.com/comicname`
			// - Pages live at second-level nested route: `dungeoncomic.com/comicname/1`, `dungeoncomic.com/comicname/settings`

			// Structure:
			// - `root`:
			//       platform homepage
			// - `root/[comicSlug]`:
			//       comic landing page, platform page
			// - `root/[comicSlug]/[comicPageNumOrName]`:
			//       comic single/content page, comic action (settings)
			// - `root/[comicSlug]/[comicPageNumOrName]/[pageAction]`:
			//       comic single/content page edit/preview
			// - `root/[comicSlug]/[comicPageNumOrName]/[pageAction][invalid]`:
			//       404

			// Get the possible segments
			const [comicSlug, comicPageNumOrName, pageAction, invalid] = segments

			// Any routes deeper than pageAction are invalid
			if (invalid) return null

			/**----------------------------------- */
			// If no level 1 route is defined: platform homepage
			// - `dungeoncomic.com`
			if (!comicSlug) {
				return { type: "platform-homepage" }
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number, with no subroute: comic landing page
			// - `dungeoncomic.com/comictitle`
			if (!/^\d+$/.test(comicSlug) && !comicPageNumOrName) {
				return {
					type: "comic-landing-page",
					comicSlug: comicSlug,
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// with a subroute that is a valid named page
			// - `dungeoncomic.com/comictitle/archive`
			if (!/^\d+$/.test(comicSlug) && isComicNamedPage(comicPageNumOrName)) {
				return {
					type: "comic-named-page",
					comicSlug: comicSlug,
					pageSlug: comicPageNumOrName,
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// with a subroute that IS a number,
			// with no page action: comic single page
			// - `dungeoncomic.com/comictitle/1`
			if (
				!/^\d+$/.test(comicSlug) &&
				/^\d+$/.test(comicPageNumOrName) &&
				!pageAction
			) {
				return {
					type: "comic-single-page",
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// with a subroute that IS a number,
			// with a valid pageAction subroute
			// : comic single page action
			// - `dungeoncomic.com/comictitle/1/edit`
			if (
				!/^\d+$/.test(comicSlug) &&
				/^\d+$/.test(comicPageNumOrName) &&
				isPageAction(pageAction)
			) {
				return {
					type: "comic-single-page-action",
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
					pageAction: pageAction,
				}
			}

			/**----------------------------------- */
			// All other cases-- return nothing (404)
			return null
		}

		case "multiple/multiple": {
			/**---------------------------------------------------------------------- */
			// Multiple Creators, Multiple Comics
			// - Comics live in a nested route with type prefix: `dungeoncomic.com/d/comicname`
			// - Pages live in a nested route with type & comic prefix:
			//   `dungeoncomic.com/d/comicname/1`, `dungeoncomic.com/d/comicname/settings`
			// - Users live in a nested route with type prefix: `dungeoncomic.com/u/username`

			// Structure:
			// - `root`:
			//      platform homepage
			// - `root/[postTypeSlug]`:
			//       comic type prefix, platform page
			// - `root/[postTypeSlug]/[postNameSlug]`:
			//       comic landing page, user profile page
			// - `root/[postTypeSlug]/[postNameSlug]/[comicPageNumOrName]`:
			//       comic single/content page, comic action (settings)
			// - `root/[postTypeSlug]/[postNameSlug]/[comicPageNumOrName]/[pageAction]`:
			//       comic single/content page edit/preview
			// - `root/[postTypeSlug]/[postNameSlug]/[comicPageNumOrName]/[pageAction]/[invalid]`:
			//       404

			// Get the possible segments
			const [
				postTypeSlug,
				postNameSlug,
				comicPageNumOrName,
				pageAction,
				invalid,
			] = segments

			// Any routes deeper than pageAction are invalid
			if (invalid) return null

			/**----------------------------------- */
			// If no level 1 route is defined: platform homepage
			// - `dungeoncomic.com`
			if (!postTypeSlug) {
				return { type: "platform-homepage" }
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number, with no subroute: category page
			// - `dungeoncomic.com/d`
			if (!/^\d+$/.test(postTypeSlug) && !postNameSlug) {
				return {
					type: "platform-category-page",
					postTypeSlug: postTypeSlug,
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// and level 2 is also defined and not a number,
			// and level 3 is undefined: comic landing page
			// - `dungeoncomic.com/d/tutorial`
			if (
				!/^\d+$/.test(postTypeSlug) &&
				!/^\d+$/.test(postNameSlug) &&
				!comicPageNumOrName
			) {
				return {
					type: "comic-landing-page",
					postTypeSlug: postTypeSlug,
					comicSlug: postNameSlug,
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// and level 2 is also defined and not a number,
			// and level 3 is a valid named page: comic named page
			// - `dungeoncomic.com/d/tutorial/settings`
			if (
				!/^\d+$/.test(postTypeSlug) &&
				!/^\d+$/.test(postNameSlug) &&
				isComicNamedPage(comicPageNumOrName)
			) {
				return {
					type: "comic-named-page",
					postTypeSlug: postTypeSlug,
					comicSlug: postNameSlug,
					pageSlug: comicPageNumOrName,
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// and level 2 is also defined and not a number,
			// and level 3 is a number, with no subroute
			// - `dungeoncomic.com/d/tutorial/1`
			if (
				!/^\d+$/.test(postTypeSlug) &&
				!/^\d+$/.test(postNameSlug) &&
				/^\d+$/.test(comicPageNumOrName) &&
				!pageAction
			) {
				return {
					type: "comic-single-page",
					postTypeSlug: postTypeSlug,
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
				}
			}

			/**----------------------------------- */
			// If level 1 route is defined and not a number,
			// and level 2 is also defined and not a number,
			// and level 3 is a number,
			// and level 4 is a valid page action
			// - `dungeoncomic.com/d/tutorial/1/edit`
			if (
				!/^\d+$/.test(postTypeSlug) &&
				!/^\d+$/.test(postNameSlug) &&
				/^\d+$/.test(comicPageNumOrName) &&
				isPageAction(pageAction)
			) {
				return {
					type: "comic-single-page-action",
					postTypeSlug: postTypeSlug,
					comicSlug: comicSlug,
					pageNum: Number(comicPageNumOrName),
					pageAction: pageAction,
				}
			}

			/**----------------------------------- */
			// All other cases-- return nothing (404)
			return null
		}

		default: {
			return null
		}
	}
}
