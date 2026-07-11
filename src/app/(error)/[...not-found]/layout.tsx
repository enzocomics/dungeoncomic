/**----------------------------------- */
import ErrorRootLayoutUI from "@/ui/error/root-layout"

/**-----------------------------------
 * ROOT LAYOUT - MAIN SITE 
 */
export default function ErrorRootLayout(props: LayoutProps<"/">) {
	return <ErrorRootLayoutUI>
		{props.children}
	</ErrorRootLayoutUI>
}