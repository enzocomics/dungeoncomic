"use server"
/**----------------------------------- */
// FUNCTIONS
import HomepageUI from "./_ui-layout"

/**-----------------------------------
 * MAIN - ROOT LAYOUT
 */
export default async function MainRootLayout(props: LayoutProps<"/">) {
	return <>
		<HomepageUI>
			{props.children}
		</HomepageUI >
	</>
}