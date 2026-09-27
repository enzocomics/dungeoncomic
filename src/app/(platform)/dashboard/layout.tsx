
import { PropsWithChildren } from "react"
import { DashboardTab, DashboardTabGroup, DashboardTabList, DashboardTabPanel, DashboardTabPanels } from "./_ui"
import clsx from "clsx"

export default function DashboardLayout(props: PropsWithChildren) {
	return <>
		<DashboardTabGroup>
			<DashboardTabList>
				<DashboardTab icon="dungeon">Dashboard</DashboardTab>
				<DashboardTab icon="skull">Profile</DashboardTab>
				<DashboardTab icon="gear">Account</DashboardTab>
				<DashboardTab as="a" href="/logout" icon="rightFromBracket" iconRight={true} className="ml-auto">Log out</DashboardTab>
			</DashboardTabList>
			<DashboardTabPanels>
				<DashboardTabPanel>1</DashboardTabPanel>
				<DashboardTabPanel>2</DashboardTabPanel>
			</DashboardTabPanels>
		</DashboardTabGroup>
		{props.children}
	</>
}
