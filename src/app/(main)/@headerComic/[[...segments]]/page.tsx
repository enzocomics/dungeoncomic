import { getComic } from "@/lib/directus/get-comics"
import { getSettings } from "@/lib/directus/get-settings"
import ClientLandingPageHeader from "@/ui/comic/components/@header/effects"
import { resolveRoute } from "@/ui/platform/functions/resolver"
import { notFound } from "next/navigation"

export default async function ComicHeader({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	const { segments = [] } = await params
	const settings = await getSettings()
	const route = await resolveRoute(segments, settings.routing_mode)
	if (!route) notFound()

	// switch(route.type){

	// }

	// const comic = await getComic(settings.frontpage_comic ? { slug: settings.frontpage_comic.slug } : {})
	// return <ClientLandingPageHeader comic={comic} settings={settings} />



	return route.type
}