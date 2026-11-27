import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientComicSettingsNavTab, ClientDashboardNavTab } from "@/ui/dashboard/components/client/nav-tab"
import type { getComic } from "@/lib/directus/get-comics"
import getComicPath from "@/ui/comic/functions/get-comic-path"
import clsx from "clsx"


export default async function ComicSettingsLayout({
	comic,
	...props }: {
		comic: Awaited<ReturnType<typeof getComic>>
	} & PropsWithChildren) {

	const comicPath = await getComicPath(comic)

	return <>
		<DashboardNav>
			<ClientComicSettingsNavTab
				icon="gaugeHigh"
				// iconOnly={true}
				href={`/dashboard`}
				title="Return to Dashboard"
				className={clsx(
					"bg-override-accent-500",
					"text-white",
					"hover:bg-override-accent-700!",
				)}
			><span className={clsx(
				// "sr-only"
			)}>Dashboard</span></ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab comicPath={comicPath} href={`${comicPath}/edit`}>
				Edit
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab comicPath={comicPath} href={`${comicPath}/pages`}>
				Pages
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab comicPath={comicPath} href={`${comicPath}/options`}>
				Options
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab comicPath={comicPath} href={`${comicPath}/content`}>
				Content
			</ClientComicSettingsNavTab>
		</DashboardNav>
		<DashboardSection>
			{props.children}
		</DashboardSection>
	</>
}

