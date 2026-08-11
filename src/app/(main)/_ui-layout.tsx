"use server"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// UI
import { Link } from "@/components/link"
import { Suspense } from "react"


/**-----------------------------------
 * HOMEPAGE - UI
 */
export default async function HomepageUI({ children }: { children: React.ReactNode }) {
	return <>
		<div className={clsx(
			""
		)}>
			<h2 className={clsx(
				"font-bold"
			)}>
				Main Root Layout
			</h2>
			Navigation:&nbsp;&nbsp;
			<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic/1">Comic Page 1</Link>
			<hr />
		</div>
		<Suspense>
			{children}
		</Suspense>
	</>
}
