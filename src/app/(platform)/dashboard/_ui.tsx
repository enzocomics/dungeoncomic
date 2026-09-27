/**----------------------------------- */
// I18N
import Icon, { icons } from "@/styles/icons"
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react"
import clsx from "clsx"
import { useTranslations } from "next-intl"
// LIBRARIES
import Link from "next/link"
import { ComponentPropsWithoutRef } from "react"

/**-----------------------------------
 * Dasboard Page UI
 */
export default function DashboardPageUI() {
	const t = useTranslations("auth")
	return <>
		<h1 className="font-platform-display text-3xl">{t("pages.dashboard.title")}</h1>
	</>
}


export const DashboardTabGroup = (props: ComponentPropsWithoutRef<typeof TabGroup>) => {
	return <>
		<TabGroup className={clsx(
		)}>
			{props.children}
		</TabGroup>
	</>
}


export const DashboardTabList = (props: ComponentPropsWithoutRef<typeof TabList>) => {
	return <>
		<TabList className={clsx(
			"-mt-6",
			"pt-2",
			"px-0",
			"md:px-2",
			"flex",
			"flex-row",
			"gap-x-2",
			// "pt-2",

			"mx-auto",
			"bg-base-2/30",
			"rounded-t",
			"dark:bg-base-3/50",
			"border-b-4",
			"border-red-500",

		)}>
			{props.children}
		</TabList>
	</>
}


export const DashboardTab = ({
	className,
	icon,
	iconRight = false,
	...props
}: {
	icon?: keyof typeof icons
	iconRight?: boolean
	href?: string,
} & ComponentPropsWithoutRef<typeof Tab>) => {
	return <>
		<Tab className={clsx(
			"cursor-pointer",
			"flex",
			"flex-row",
			"items-center",
			"px-4",
			"pt-2",
			"pb-1",
			"font-semibold",
			"font-platform-headers",
			"text-md",
			"text-base-content/30",
			"rounded-t",
			"border-b-2",
			"border-b-transparent",
			"bg-base-2/40",
			"data-selected:bg-red-500",
			"data-selected:text-white",
			className
		)}
			{...props}
		>
			<>
				{icon && !iconRight &&
					<Icon name={icon} className={clsx(
						"size-4",
						"mr-1.5",
					)} />
				}
				{props.children}
				{icon && iconRight &&
					<Icon name={icon} className={clsx(
						"size-4",
						"ml-1.5",
					)} />

				}
			</>
		</Tab>
	</>
}



export const DashboardTabPanels = (props: ComponentPropsWithoutRef<typeof TabPanels>) => {
	return <>
		<TabPanels>
			{props.children}
		</TabPanels>
	</>
}

export const DashboardTabPanel = (props: ComponentPropsWithoutRef<typeof TabPanel>) => {
	return <>
		<TabPanel>
			{props.children}
		</TabPanel>
	</>
}

