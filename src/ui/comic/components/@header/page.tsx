/**----------------------------------- */
import { getSettings } from "@/lib/directus/get-settings"
import { getComic } from "@/lib/directus/get-comics"
import ClientLandingPageHeader from "./effects"


/**
 * - Returns the Landing Page Logo or Title of a comic if a slug is provided
 * - If no slug is provided, it will fall back to the selected frontpage comic
 * - If no frontpage comic is selected it will choose the first one
 * - `ClientLandingPageHeader falls back to the project logo/title if nothing is found
 * 
 */
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