/**----------------------------------- */
import clsx from "clsx"
import { sanitize } from "@/lib/sanitize"
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
import { LandingPageBody, LandingPageHeader, LandingPageWrapper, LandingPageContent, LandingPageH1 } from "../../../../ui/platform/components/page-landing"

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

