
import { PropsWithChildren } from "react"
import { DashboardTab, DashboardTabGroup, DashboardTabList, DashboardTabPanel, DashboardTabPanels } from "./_ui"
import clsx from "clsx"
import Link from "next/link"

export default function DashboardLayout({
	profile,
	settings,
	...props
}: {
	profile?: React.ReactNode
	settings?: React.ReactNode
} & PropsWithChildren) {
	return <>
		<DashboardTabGroup>
			<DashboardTabList>
				<DashboardTab asLink={true} href="/dashboard" icon="dungeon">Dashboard</DashboardTab>
				<DashboardTab asLink={true} href="/dashboard/profile" icon="skull">Profile</DashboardTab>
				<DashboardTab asLink={true} href="/dashboard/settings" icon="gear">Account</DashboardTab>
			</DashboardTabList>
			<DashboardTabPanels>
				<DashboardTabPanel>{props.children}</DashboardTabPanel>
				<DashboardTabPanel>{profile}</DashboardTabPanel>
				<DashboardTabPanel>{settings}</DashboardTabPanel>
			</DashboardTabPanels>
		</DashboardTabGroup>

	</>
}
