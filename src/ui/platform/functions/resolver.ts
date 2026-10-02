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

// #TODO: in the future this should dynamically fetch any pages created by the user (i.e. archive, about, cast, etc)
type ComicNamedPage = "archive"

function isComicNamedPage(value: unknown) {
	return value === "archive"
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
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
	  }
	| {
			type: "comic-action"
			postTypeSlug?: string
			comicAction: ComicAction
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
	| {
			type: "comic-named-page"
			postTypeSlug?: string
			comicSlug: Awaited<ReturnType<typeof getComic>>["slug"]
			pageSlug: ComicNamedPage
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
		/**----------------------------------- */
		case "single/single": {
			// Single Creator, Single Comic
			// - Comic lives at root: `dungeoncomic.com`
			// - Pages live at first-level route: `dungeoncomic.com/1`, `dungeoncomic.com/settings`

			// Structure:
			// - `root`:
			//       comic landing page,
			// - `root/[comicPageOrComicAction]`:
			//       comic single/content page, comic action
			// - `root/[comicPageOrComicAction]/[pageAction]`:
			//       comic single/content page edit/preview
			// - `root/[comicPageOrComicAction]/[pageAction]/[invalid]`:
			//       404

			// Get the possible segments
			const [comicPageOrComicAction, pageAction, invalid] = segments

			// Any routes deeper than pageAction are invalid
			if (invalid) return null

			// If no level 1 route is defined
			// - `dungeoncomic.com`
			if (!comicPageOrComicAction) {
				const comic = await getComic({})
				if (comic)
					// If any comic exists, return the landing page
					return {
						type: "comic-landing-page",
						comicSlug: comicSlug,
					}
				else
					// fallback to platform homepage if no comic exists
					return {
						type: "platform-homepage",
					}
			}
			// If the level 1 route is a defined comic action
			// - `dungeoncomic.com/settings`
			if (isComicAction(comicPageOrComicAction))
				return {
					type: "comic-action",
					comicAction: comicPageOrComicAction,
				}

			// If the level 1 route is a number + no subroute
			// - `dungeoncomic.com/1`
			if (/^\d+$/.test(comicPageOrComicAction) && !pageAction)
				return {
					type: "comic-single-page",
					comicSlug: comicSlug,
					pageNum: Number(comicPageOrComicAction),
				}

			// If the level 1 route is a number + valid pageAction subroute
			// - `dungeoncomic.com/1/edit`
			if (/^\d+$/.test(comicPageOrComicAction) && isPageAction(pageAction))
				return {
					type: "comic-single-page-action",
					comicSlug: comicSlug,
					pageNum: Number(comicPageOrComicAction),
					pageAction: pageAction,
				}

			// If the level 1 route is NOT a number, and is a valid named page
			// - `dungeoncomic.com/archive`
			if (
				!/^\d+$/.test(comicPageOrComicAction) &&
				isComicNamedPage(comicPageOrComicAction)
			)
				return {
					type: "comic-named-page",
					comicSlug: comicSlug,
					pageSlug: comicPageOrComicAction,
				}

			// All other cases-- return nothing (404)
			return null
		}

		/**----------------------------------- */
		case "single/multiple": {
			// Single Creator, Multiple Comics
			// - Comics live at first-level route: `dungeoncomic.com/comicname`
			// - Pages live at second-level nested route: `dungeoncomic.com/comicname/1`, `dungeoncomic.com/comicname/settings`

			// Structure:
			// - `root`:
			//       platform homepage
			// - `root/[comicSlug]`:
			//       comic landing page, platform page
			// - `root/[comicSlug]/[pageNumOrComicAction]`:
			//       comic single/content page, comic action (settings)
			// - `root/[comicSlug]/[pageNumOrComicAction]/[pageAction]`:
			//       comic single/content page edit/preview
			// - `root/[comicSlug]/[pageNumOrComicAction]/[pageAction][invalid]`:
			//       404

			// Get the possible segments
			const [comicSlug, pageNumOrComicAction, pageAction, invalid] = segments

			return {
				type: "platform-homepage",
			}
		}

		/**----------------------------------- */
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
		// - `root/[postTypeSlug]/[postNameSlug]/[pageNumOrComicAction]`:
		//       comic single/content page, comic action (settings)
		// - `root/[postTypeSlug]/[postNameSlug]/[pageNumOrComicAction]/[pageAction]`:
		//       comic single/content page edit/preview
		// - `root/[postTypeSlug]/[postNameSlug]/[pageNumOrComicAction]/[pageAction]/[invalid]`:
		//       404

		case "multiple/multiple": {
			const [
				postTypeSlug,
				postNameSlug,
				pageNumOrComicAction,
				pageAction,
				invalid,
			] = segments

			return {
				type: "platform-homepage",
			}
		}

		default: {
			return null
		}
	}
}
