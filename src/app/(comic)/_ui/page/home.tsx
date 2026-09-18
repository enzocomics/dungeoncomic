/**----------------------------------- */
import { verifySession } from "@/data/session"
import { LandingPageBody, LandingPageHeader, LandingPageWrapper, LandingPageContent } from "./components"
/**-----------------------------------
 * HOMEPAGE PAGE UI
 * ---
 */
export function HomepagePageUI({
	content
}: {
	content?: string
}) {

	return <>
		<LandingPageWrapper>
			<LandingPageHeader>
				asdf
			</LandingPageHeader>
			<LandingPageBody>
				<LandingPageContent content={content} />
			</LandingPageBody>
		</LandingPageWrapper>
	</>
}

