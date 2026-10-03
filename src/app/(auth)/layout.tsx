"use server"
import StatusMessage from "@/components/status-message"
/**----------------------------------- */
import { AuthLayout } from "./_ui"
import { Suspense } from "react"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <>
		<Suspense>
			<StatusMessage />

			<AuthLayout>
				{props.children}
			</AuthLayout>
		</Suspense>
	</>
}