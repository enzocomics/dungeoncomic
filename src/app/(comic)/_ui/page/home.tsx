/**----------------------------------- */
import clsx from "clsx"
import { sanitize } from "@/lib/sanitize"
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
import { LandingPageBody, LandingPageHeader, LandingPageWrapper, LandingPageContent, LandingPageH1 } from "../../../_ui/page-landing"
import StatusMessage from "@/components/status-message"
import LandingPageLogo from "../../[route]/@header/_effects"
import ClientLandingPageHeader from "../../[route]/@header/_effects"

/**-----------------------------------
 * HOMEPAGE PAGE UI
 * ---
 */
export async function HomepagePageUI({
	content
}: {
	content?: string
}) {
	const settings = await getSettings()
	const projectName = sanitize(String(settings.project_name))
	const banner = settings.project_banner
	const logo = settings.project_logo

	return <>
		<LandingPageWrapper>
			<LandingPageBody>
				<LandingPageContent content={content} />
			</LandingPageBody>
		</LandingPageWrapper>
	</>
}

