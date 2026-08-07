"use server"
/**----------------------------------- */
// I18N
import { Link } from "@/components/link"
import { StackedLayout } from "@/components/stacked-layout"

/**-----------------------------------
 * HOMEPAGE - UI
 */
export default async function HomepageUI({ children }: { children: React.ReactNode }) {
	return <>
		<StackedLayout
			navbar={<>Navbar</>}
			sidebar={<>Sidebar</>}
		>
			<div>
				Main Root Layout<br />
				Navigation:&nbsp;&nbsp;
				<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
				<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
				<Link href="/dungeoncomic/1">Comic Page 1</Link>
				<hr />
			</div>
			{children}
		</StackedLayout >
	</>
}
