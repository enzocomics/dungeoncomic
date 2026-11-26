import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientComicSettingsNavTab, ClientDashboardNavTab } from "@/ui/dashboard/components/client/nav-tab"

export default function ComicSettingsLayout({ ...props }: {} & PropsWithChildren) {
	return <>
		<DashboardNav>
			<ClientComicSettingsNavTab href="./edit">
				Settings
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href="./edit/pages">
				Pages
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href="./edit/options">
				Options
			</ClientComicSettingsNavTab>
			<ClientComicSettingsNavTab href="./edit/options">
				Content
			</ClientComicSettingsNavTab>
		</DashboardNav>
		<DashboardSection>
			{props.children}
		</DashboardSection>
	</>
}

