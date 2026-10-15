/**----------------------------------- */
import RedirectIfAuthenticated from "@/ui/auth/functions/auth-redirect"
import AuthRootLayoutUI from "@/ui/auth/layout"
import { Suspense } from "react"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <>
		<Suspense>
			<RedirectIfAuthenticated>
				<AuthRootLayoutUI>
					{props.children}
				</AuthRootLayoutUI>
			</RedirectIfAuthenticated>
		</Suspense>
	</>
}