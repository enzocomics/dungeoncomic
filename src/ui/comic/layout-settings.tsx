import { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import { verifySession } from "@/data/session"
import { redirect } from "next/navigation"
import { getSettings } from "@/lib/directus/get-settings"
import { DashboardNav, DashboardSection } from "@/ui/dashboard/components/nav"
import { ClientDashboardNavTab } from "@/ui/dashboard/components/client/nav-tab"

export default function ComicSettingsLayout({ ...props }: {} & PropsWithChildren) {
	return <div>
		<DashboardNav>

		</DashboardNav>
		{props.children}
	</div>
}