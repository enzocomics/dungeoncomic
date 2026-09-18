import { getSettings } from "@/lib/directus/get-settings"
import { notFound } from "next/navigation"

export default async function List() {
	const settings = await getSettings()
	const singleComic = !!settings.single_comic_site

	if (singleComic) notFound()
	return <>
		hi
	</>
}