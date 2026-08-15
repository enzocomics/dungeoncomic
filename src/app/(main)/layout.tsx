"use server"
/**----------------------------------- */
// FUNCTIONS
import HomepageLayoutUI from "./_layout-ui"

/**-----------------------------------
 * MAIN - ROOT LAYOUT
 */
export default async function MainRootLayout(props: LayoutProps<"/">) {
	return <>
		<HomepageLayoutUI>
			{props.children}
		</HomepageLayoutUI >
	</>
}