import { PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientDashboardNavTab } from "./components/client/nav-tab"

export default async function DashboardRootLayoutUI({
	children
}: {
	children: React.ReactNode
}) {
	const settings = await getSettings()
	return <>
		<DashboardNav>
			<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard" icon="dungeon">Dashboard</ClientDashboardNavTab>
			<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard/profile" icon="skull">Profile</ClientDashboardNavTab>
			<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard/account" icon="user">Account</ClientDashboardNavTab>
			<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard/settings" icon="gear">Settings</ClientDashboardNavTab>
		</DashboardNav>
		<DashboardSection>
			{children}
		</DashboardSection>
	</>
}