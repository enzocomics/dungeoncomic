/**----------------------------------- */
import AuthRootLayoutUI from "@/ui/auth/root-layout"

/**-----------------------------------
 * ROOT LAYOUT - AUTH
 */
export default function AuthRootLayout(props: LayoutProps<"/">) {
	return <AuthRootLayoutUI>
		{props.children}
	</AuthRootLayoutUI>
}