import { PropsWithChildren } from "react"
import { DashboardLayoutUI, DashboardNav, DashboardSection } from "./_ui/layout"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
	...props
}: {
} & PropsWithChildren) {
	const user = await verifySession()
	// Only show this route if the user is logged in
	if (user) return <>
		<DashboardLayoutUI>
			{props.children}
		</DashboardLayoutUI>
	</>
	else redirect("/login")
}
