"use server"
/**----------------------------------- */
import { AuthLayout } from "./_ui"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <AuthLayout>
		{props.children}
	</AuthLayout>
}