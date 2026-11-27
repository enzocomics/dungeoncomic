import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientComicSettingsNavTab, ClientDashboardNavTab } from "@/ui/dashboard/components/client/nav-tab"
import type { getComic } from "@/lib/directus/get-comics"
import getComicPath from "@/ui/comic/functions/get-comic-path"


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

