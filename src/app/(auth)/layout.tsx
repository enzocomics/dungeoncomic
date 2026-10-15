
import StatusMessage from "@/components/status-message"
/**----------------------------------- */
import { AuthLayout } from "./_ui"
import { Suspense } from "react"
import AuthRootLayoutUI from "@/ui/auth/layout"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <AuthRootLayoutUI>
		{props.children}
	</AuthRootLayoutUI>
}