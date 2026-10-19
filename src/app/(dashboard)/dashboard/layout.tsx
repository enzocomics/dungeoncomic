import { PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import DashboardRootLayoutUI from "@/ui/dashboard/layout"
import { connection } from "next/server"

export const instant = false

export default async function DashboardLayout({
	children,
}: LayoutProps<"/dashboard">) {
	return <>
		<DashboardLayoutContent>
			{children}
		</DashboardLayoutContent>
	</>
}

async function DashboardLayoutContent({
	...props
}: {
} & PropsWithChildren) {
	await connection()
	const user = await verifySession()
	// Only show this route if the user is logged in
	if (user)
		return <DashboardRootLayoutUI>
			{props.children}
		</DashboardRootLayoutUI>
	else redirect("/login")
}
