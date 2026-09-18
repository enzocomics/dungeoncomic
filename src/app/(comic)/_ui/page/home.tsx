/**----------------------------------- */
import { verifySession } from "@/data/session"
import { LandingPageBody, LandingPageHeader, LandingPageWrapper, LandingPageContent, LandingPageH1 } from "./components"
import clsx from "clsx"
import { getSettings } from "@/lib/directus/get-settings"
import { sanitize } from "@/lib/sanitize"
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
	const banner = settings.project_banner
	const projectName = sanitize(String(settings.project_name))


	const hasBanner = !!banner

	return <>
		<LandingPageWrapper>
			<LandingPageHeader>
				<LandingPageH1 className={clsx(
					hasBanner && [
						"text-white",
						"[text-stroke:16px_black",
						"[-webkit-text-stroke:16px_black]",
						"[paint-order:stroke_fill]",
						"drop-shadow-black/50",
						"drop-shadow-md",
					],
				)}>
					{projectName}
				</LandingPageH1>
			</LandingPageHeader>
			<LandingPageBody>
				<LandingPageContent content={content} />
			</LandingPageBody>
		</LandingPageWrapper>
	</>
}

