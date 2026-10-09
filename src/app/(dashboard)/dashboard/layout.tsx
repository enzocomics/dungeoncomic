import { PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import DashboardRootLayoutUI from "@/ui/dashboard/layout"
export const instant = false
export default async function DashboardLayout({
	...props
}: {
} & PropsWithChildren) {
	const user = await verifySession()
	// Only show this route if the user is logged in
	if (user)
		return <DashboardRootLayoutUI>
			{props.children}
		</DashboardRootLayoutUI>
	else redirect("/login")
}
