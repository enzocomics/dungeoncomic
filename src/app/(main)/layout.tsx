"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

/**-----------------------------------
 * MAIN - ROOT LAYOUT
 */
export default async function MainRootLayout(props: LayoutProps<"/">) {
	return <>
		{props.children}
	</>
}