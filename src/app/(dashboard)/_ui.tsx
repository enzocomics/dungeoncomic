"use server"

import { Avatar } from "@/components/avatar"
import { Dropdown, DropdownButton, DropdownDivider, DropdownItem, DropdownLabel, DropdownMenu } from "@/components/dropdown"
import { Navbar, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from "@/components/navbar"
import { Sidebar, SidebarBody, SidebarDivider, SidebarFooter, SidebarHeader, SidebarHeading, SidebarItem, SidebarLabel, SidebarSection } from "@/components/sidebar"
import { SidebarLayout } from "@/components/sidebar-layout"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRightFromBracket, faGauge, faChessRook, faChevronDown, faChevronUp, faGear, faSquarePlus, faUser } from "@fortawesome/free-solid-svg-icons"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/button"


export default async function DashboardLayoutUI({
	children
}: {
	children: React.ReactNode | null
}) {
	return <>
		<SidebarLayout
			sidebar={<SidebarUI />}
			navbar={<NavbarUI />}
		>
			{children}
		</SidebarLayout>
	</>
}

function SidebarUI() {
	return <Sidebar>
		<SidebarHeader>

			<Button color="primary">
				<FontAwesomeIcon icon={faSquarePlus} className="size-4 top-0.5 relative" />
				New Adventure
			</Button>
			<SidebarSection>
				{/* <SidebarItem>
					<Avatar src="/apple-touch-icon.png" />
					<SidebarLabel>Dungeon Comics</SidebarLabel>
				</SidebarItem> */}
			</SidebarSection>
		</SidebarHeader>
		<SidebarBody>

			<SidebarSection className="max-lg:hidden">
				<SidebarHeading>Adventures</SidebarHeading>
				<SidebarItem href="/dungeon/1" current>
					Cheer Up, Emo Kid
				</SidebarItem>
				<SidebarItem href="/dungeon/2">Dungeon Construction Co.</SidebarItem>
				<SidebarDivider />

				<SidebarItem href="/dashboard">
					<FontAwesomeIcon icon={faGauge} className="size-4" />
					Dashboard
				</SidebarItem>
				<SidebarItem href="/dashboard/settings">
					<FontAwesomeIcon icon={faGear} className="size-4" />
					Settings
				</SidebarItem>
			</SidebarSection>

		</SidebarBody>
		<SidebarFooter className="max-lg:hidden">
			<Dropdown>
				<DropdownButton as={SidebarItem}>
					<span className="flex min-w-0 items-center gap-3">
						<Avatar src="/apple-touch-icon.png" className="size-10" square alt="" />
						<span className="min-w-0">
							<span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">enzocomics</span>
							<span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
								enzo@cheerupemokid.com
							</span>
						</span>
					</span>
					<FontAwesomeIcon icon={faChevronUp} className="size-4" />
				</DropdownButton>
				<DropdownMenu className="min-w-64" anchor="top start">
					<DropdownItem href="/my-profile">
						<FontAwesomeIcon icon={faUser} className="size-4" />
						<DropdownLabel>My profile</DropdownLabel>
					</DropdownItem>
					<DropdownItem href="/settings">
						<FontAwesomeIcon icon={faGear} className="size-4" />
						<DropdownLabel>Settings</DropdownLabel>
					</DropdownItem>
					<DropdownDivider />
					<DropdownItem href="/logout">
						<FontAwesomeIcon icon={faArrowRightFromBracket} className="size-4" />
						<DropdownLabel>Sign out</DropdownLabel>
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</SidebarFooter>
	</Sidebar>
}

function NavbarUI() {
	return <Navbar>
		<NavbarSection className="max-lg:hidden">
			<NavbarItem href="/dashboard">
				Dashboard
			</NavbarItem>
			<NavbarItem href="/dashboard/settings">Settings</NavbarItem>

		</NavbarSection>
		<NavbarSpacer />

		<NavbarSection>
			<Dropdown>
				<DropdownButton as={NavbarItem}>
					enzocomics
					<Avatar src="/apple-touch-icon.png" square />
				</DropdownButton>

				<DropdownMenu className="min-w-64" anchor="bottom end">
					<DropdownItem>
						Edit profile
					</DropdownItem>
					<DropdownItem>
						Account Settings
					</DropdownItem>
					<DropdownItem href="/logout">
						Sign Out
					</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</NavbarSection>
	</Navbar>
}