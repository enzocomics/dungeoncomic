
import { PropsWithChildren } from "react"
import { DashboardNavTab, DashboardNav, DashboardTabPanel, DashboardTabPanels } from "./_ui"
import clsx from "clsx"
import Link from "next/link"

export default function DashboardLayout({
	// profile,
	// settings,
	...props
}: {
	// profile?: React.ReactNode
	// settings?: React.ReactNode
} & PropsWithChildren) {
	return <>
		{/* <DashboardTabGroup> */}
		<DashboardNav>
			<DashboardNavTab href="/dashboard" icon="dungeon">Dashboard</DashboardNavTab>
			<DashboardNavTab href="/dashboard/profile" icon="skull">Profile</DashboardNavTab>
			<DashboardNavTab href="/dashboard/settings" icon="gear">Account</DashboardNavTab>
		</DashboardNav>
		{props.children}
		{/* </DashboardTabGroup> */}

	</>
}
