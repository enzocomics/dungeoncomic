/**----------------------------------- */
import AuthRootLayoutUI from "@/ui/auth/layout"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayout(props: LayoutProps<"/">) {
	return <AuthRootLayoutUI>
		{props.children}
	</AuthRootLayoutUI>
}