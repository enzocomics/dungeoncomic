import { getSettings } from "@/lib/directus/get-settings"
import { getComic } from "@/lib/directus/get-comics"

import ClientLandingPageHeader from "./effects"

export default async function ParallelHeaderUI({
	slug
}: {
	slug?: string
}) {
	const settings = await getSettings()
	const frontpageComic = settings.frontpage_comic

	const comic =
		slug
			? await getComic({ slug: slug })
			: frontpageComic
				? await getComic({ slug: frontpageComic.slug })
				: await getComic({})

	return <>
		<ClientLandingPageHeader comic={comic} settings={settings} />
	</>
}