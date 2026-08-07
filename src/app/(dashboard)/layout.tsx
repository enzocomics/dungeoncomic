"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
import DashboardLayoutUI from "./_ui"

/**-----------------------------------
 * DASHBOARD - ROOT LAYOUT
 */
export default async function DashboardRootLayout(props: LayoutProps<"/">) {
	return <DashboardLayoutUI>
		{props.children}
	</DashboardLayoutUI>
}