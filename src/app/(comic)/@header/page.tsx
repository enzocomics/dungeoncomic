import { getComic } from "@/lib/directus/get-comics"
import ClientLandingPageHeader from "../[route]/@header/_effects"
import ParallelHeader from "../[route]/@header/page"
import { getSettings } from "@/lib/directus/get-settings"

export default async function Page({
	params
}: {
	params: Promise<{ route: string }>
}) {
	const { route } = await params
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic
	const comic = frontpageComic ? await getComic({ slug: frontpageComic.slug }) : await getComic({})
	// const hasLogo = !!comic.logo
	// const hasBanner = !!comic.banner
	return <>
		<ClientLandingPageHeader comic={comic} settings={settings} />
	</>
}