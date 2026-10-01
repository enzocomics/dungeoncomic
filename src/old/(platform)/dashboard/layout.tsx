import { PropsWithChildren } from "react"
import { DashboardNav, DashboardSection } from "./_ui/layout"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { ClientDashboardNavTab } from "./_ui/client/layout"
import { getSettings } from "@/lib/directus/get-settings"

export default async function DashboardLayout({
	...props
}: {
} & PropsWithChildren) {
	const settings = await getSettings()
	const user = await verifySession()
	// Only show this route if the user is logged in
	if (user)
		return <>
			<DashboardNav>
				<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard" icon="dungeon">Dashboard</ClientDashboardNavTab>
				<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard/profile" icon="skull">Profile</ClientDashboardNavTab>
				<ClientDashboardNavTab postTypeSlug={settings.post_type_name_slug} href="/dashboard/settings" icon="gear">Account</ClientDashboardNavTab>
			</DashboardNav>
			<DashboardSection>
				{props.children}
			</DashboardSection>
		</>
	else redirect("/login")
}
