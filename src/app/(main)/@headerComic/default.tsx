import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import ClientLandingPageHeader from "@/ui/comic/components/@header/effects"

export default async function ComicHeader() {
	const settings = await getSettings()
	const comic = await getComic(settings.frontpage_comic ? { slug: settings.frontpage_comic.slug } : {})
	return <ClientLandingPageHeader comic={comic} settings={settings} />
}