/**----------------------------------- */
// LIBRARIES
import { Suspense } from "react"
// UI
import RedirectIfAuthenticated from "@/ui/auth/functions/auth-redirect"
import AuthRootLayoutUI from "@/ui/auth/layout"

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