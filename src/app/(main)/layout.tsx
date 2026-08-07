"use server"
import { Link } from "@/components/link"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"

/**-----------------------------------
 * MAIN - ROOT LAYOUT
 */
export default async function MainRootLayout(props: LayoutProps<"/">) {
	return <>
		<div>
			Main Root Layout<br />
			Navigation:&nbsp;&nbsp;
			<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic/1">Comic Page 1</Link>
			<hr />
		</div>
		{props.children}
	</>
}