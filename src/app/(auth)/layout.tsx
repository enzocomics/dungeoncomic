"use server"
import StatusMessage from "@/components/status-message"
/**----------------------------------- */
import { AuthLayout } from "./_ui"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <>

		<StatusMessage />
		<AuthLayout>
			{props.children}
		</AuthLayout>
	</>
}