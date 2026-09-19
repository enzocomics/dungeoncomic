import { LandingPageBody, LandingPageContent } from "@/app/_ui/page-landing"
import { getSettings } from "@/lib/directus/get-settings"
import { notFound } from "next/navigation"
import { ListPageUI } from "./_ui"
import { getComic, getComics } from "@/lib/directus/get-comics"

export default async function List() {
	const settings = await getSettings()
	const singleComic = !!settings.single_comic_site

	// Don't show this route on single-comic sites
	if (singleComic) notFound()

	const comics = await getComics()

	return <>
		<ListPageUI />
	</>
}