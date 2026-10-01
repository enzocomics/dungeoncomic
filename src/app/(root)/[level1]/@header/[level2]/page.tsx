import { ClientComicPageHeaderTitle } from "@/ui/comic/components/client/comic-page-header-title"
import { getComic, getComicPage } from "@/lib/directus/get-comics"
import { notFound } from "next/navigation"

export default async function Level2ParallelHeader({
	params
}: {
	params: Promise<{ level1: string, level2: string }>
}) {
	const { level1, level2 } = await params
	if (typeof level1 === "string" && !isNaN(parseInt(level2))) {
		const comic = await getComic({ slug: level1 })
		const comicPage = await getComicPage(comic.slug, parseInt(level2))

		// if (!comicPage) notFound()
		return <>
			{/* <ClientComicPageHeaderTitle comic={comic} /> */}
			level 1 &raquo; level 2 parallel header
		</>
	}
}