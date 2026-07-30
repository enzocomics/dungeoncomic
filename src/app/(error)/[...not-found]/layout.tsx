"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

export default async function ErrorRootLayoutUI(props: LayoutProps<"/[...not-found]">) {
	return <>
		{props.children}
	</>
}