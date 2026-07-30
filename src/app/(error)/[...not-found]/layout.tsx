"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

/**-----------------------------------
 * ERROR - ROOT LAYOUT
 */
export default async function ErrorRootLayoutUI(props: LayoutProps<"/[...not-found]">) {
	return <>
		{props.children}
	</>
}