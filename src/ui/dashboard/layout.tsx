import { PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientDashboardNavTab } from "./components/client/nav-tab"
import clsx from "clsx"

export default async function DashboardRootLayoutUI({
	children
}: {
	children: React.ReactNode
}) {
	const settings = await getSettings()
	const session = await verifySession()
	const userCanUpdateSettings = session?.permissions?.settings?.update?.access === "full"
	return <>
		<DashboardNav>
			<ClientDashboardNavTab postTypeSlug={settings.comic_type_name_slug} href="/dashboard" icon="gaugeHigh">Dashboard</ClientDashboardNavTab>
			{userCanUpdateSettings &&
				<>
					<ClientDashboardNavTab postTypeSlug={settings.comic_type_name_slug} href="/dashboard/theme" icon="gear">Theme</ClientDashboardNavTab>
					<ClientDashboardNavTab postTypeSlug={settings.comic_type_name_slug} href="/dashboard/settings" icon="gear">Settings</ClientDashboardNavTab>
				</>
			}
			<ClientDashboardNavTab className={clsx(
				"ml-auto"
			)} postTypeSlug={settings.comic_type_name_slug} href="/dashboard/profile" icon="skull">Profile</ClientDashboardNavTab>
			<ClientDashboardNavTab postTypeSlug={settings.comic_type_name_slug} href="/dashboard/account" icon="user">Account</ClientDashboardNavTab>
		</DashboardNav>
		<DashboardSection>
			{children}
		</DashboardSection>
	</>
}