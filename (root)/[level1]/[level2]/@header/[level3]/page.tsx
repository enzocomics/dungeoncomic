import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"
import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import { notFound } from "next/navigation"

export default async function Level3ParallelHeader({
	params
}: {
	params: Promise<{ level1: string, level2: string, level3: string }>
}) {
	// const { level1, level2, level3 } = await params
	// const settings = await getSettings()
	// if (
	// 	level1 === settings.post_type_name_slug
	// 	&& typeof level2 === "string"
	// 	&& !isNaN(parseInt(level3))
	// ) {
	// 	const comic = await getComic({ slug: level2 })
	// 	const comicPage = await getComicPage(comic.slug, parseInt(level3))

	// 	if (!comicPage) notFound()
	// 	return <>
	// 		<ClientComicPageHeaderTitle comic={comic} />
	// 	</>
	// }
	return <>
		level 2 &raquo; level 3 parallel header
	</>
}