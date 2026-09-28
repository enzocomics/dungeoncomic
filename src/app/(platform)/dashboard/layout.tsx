
import { PropsWithChildren } from "react"
import { ClientDashboardNavTab } from "./_ui/client/layout"
import { DashboardNav, DashboardSection } from "./_ui/layout"

export default function DashboardLayout({
	...props
}: {
} & PropsWithChildren) {
	return <>
		<DashboardNav>
			<ClientDashboardNavTab href="/dashboard" icon="dungeon">Dashboard</ClientDashboardNavTab>
			<ClientDashboardNavTab href="/dashboard/profile" icon="skull">Profile</ClientDashboardNavTab>
			<ClientDashboardNavTab href="/dashboard/settings" icon="gear">Account</ClientDashboardNavTab>
		</DashboardNav>
		<DashboardSection>
			{props.children}
		</DashboardSection>
	</>
}
