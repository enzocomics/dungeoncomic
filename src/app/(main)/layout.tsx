/**----------------------------------- */
import MainRootLayoutUI from "@/ui/main/root-layout"

/**-----------------------------------
 * ROOT LAYOUT - MAIN SITE 
 */
export default function MainRootLayout(props: LayoutProps<"/">) {
	return <MainRootLayoutUI>
		{props.children}
	</MainRootLayoutUI>
}