import clsx from "clsx"
import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { ClientDashboardNavTab } from "./client/layout"

export const DashboardLayoutUI = (props: PropsWithChildren) => {
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

export const DashboardNav = (props: ComponentPropsWithoutRef<"nav">) => {
	return <>
		<nav className={clsx(
			"-mt-6",
			"pt-2",
			"px-0",
			"md:px-2",
			"flex",
			"flex-row",
			"w-full",
			"gap-x-1",
			// "pt-2",

			"mx-auto",
			"bg-base-2/30",
			"rounded-t",
			"dark:bg-base-3/50",
			"border-b-4",
			"border-red-500",
			"text-sm",
			"md:text-base",

		)}>
			{props.children}
		</nav>
	</>
}

export const DashboardSection = (props: ComponentPropsWithoutRef<"section">) => {
	return <>
		<section className={clsx(
			"px-6",
		)}>
			{props.children}
		</section>
	</>
}