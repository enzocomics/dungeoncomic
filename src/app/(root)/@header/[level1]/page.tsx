import { getComic, getComicPage } from "@/lib/directus/get-comics";
import { ClientComicPageHeaderTitle } from "../../../../ui/comic/components/client/comic-page-header-title";
import { getSettings } from "@/lib/directus/get-settings";
import { notFound } from "next/navigation";

export default async function Level1ParallelHeader({
	params
}: {
	params: Promise<{ level1: string }>
}) {
	const { level1 } = await params
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
	const comic = await getComic(frontpageComic ? { slug: frontpageComic.slug } : {})
	const comicPage = await getComicPage(comic.slug, parseInt(level1))

	if (!comicPage) notFound()
	return <>
		<ClientComicPageHeaderTitle comic={comic} />
	</>

}