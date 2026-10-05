import { PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import DashboardRootLayoutUI from "@/ui/dashboard/layout"

export default async function DashboardLayout({
	...props
}: {
} & PropsWithChildren) {
	const settings = await getSettings()
	const user = await verifySession()
	// Only show this route if the user is logged in
	if (user)
		return <DashboardRootLayoutUI>
			{props.children}
		</DashboardRootLayoutUI>
	else redirect("/login")
}
