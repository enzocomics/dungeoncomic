import { ClientComicPageHeaderTitle } from "@/app/(comic)/_ui/page/client/comic-page-header-title";
import { getComic, getComicPage } from "@/lib/directus/get-comics";
import { getSettings } from "@/lib/directus/get-settings";

export default async function Page({
	params
}: {
	params: Promise<{ route: string }>
}) {

	// GET THE ROUTE PARAMS
	const { route } = await params
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
	const comic = frontpageComic ? await getComic({ slug: frontpageComic.slug }) : await getComic({})
	const page = await getComicPage(comic.slug, parseInt(route))
	return <>
		<ClientComicPageHeaderTitle page={page} />
	</>
}