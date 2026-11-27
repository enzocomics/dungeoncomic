import { getSettings } from "@/lib/directus/get-settings"

import type { getComic } from "@/lib/directus/get-comics"
export default async function getComicPath(comic: Awaited<ReturnType<typeof getComic>>) {
	const settings = await getSettings()
	const typeSlug = settings.comic_type_name_slug

	let comicPath
	switch (settings.routing_mode) {
		case "single-single": {
			comicPath = "./"
		} break
		case "single-multiple": {
			comicPath = `/${comic.slug}`
		} break
		case "multiple-multiple": {
			comicPath = `/${typeSlug}/${comic.slug}`
		} break
	}

	return comicPath
}