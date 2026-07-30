"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

export default async function DashboardRootLayoutUI(props: LayoutProps<"/">) {
	return <>
		{props.children}
	</>
}