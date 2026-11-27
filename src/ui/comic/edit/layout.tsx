import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientComicSettingsNavTab, ClientDashboardNavTab } from "@/ui/dashboard/components/client/nav-tab"
import type { getComic } from "@/lib/directus/get-comics"

const getComicPath = async (comic: Awaited<ReturnType<typeof getComic>>) => {
	const settings = await getSettings()
	const typeSlug = settings.comic_type_name_slug

	let comicPath
	switch (settings.routing_mode) {
		case "single-single": {
			comicPath = "./"
		} break
		case "single-multiple": {
			comicPath = `/${comic.slug}`
		} break
		case "multiple-multiple": {
			comicPath = `/${typeSlug}/${comic.slug}`
		} break
	}

	return comicPath
}

export default async function ComicSettingsLayout({
	comic,
	...props }: {
		comic: Awaited<ReturnType<typeof getComic>>
	} & PropsWithChildren) {

	const comicPath = await getComicPath(comic)

	return <>
		<DashboardNav>
			<ClientComicSettingsNavTab href={`${comicPath}/edit`}>
				Edit
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href={`${comicPath}/pages`}>
				Pages
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href={`${comicPath}/options`}>
				Options
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href={`${comicPath}/content`}>
				Content
			</ClientComicSettingsNavTab>
		</DashboardNav>
		<DashboardSection>
			{props.children}
		</DashboardSection>
	</>
}

