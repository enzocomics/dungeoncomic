/**----------------------------------- */
import clsx from "clsx"
import { sanitize } from "@/lib/sanitize"
import { directusURL } from "@/data/env"
import { getSettings } from "@/lib/directus/get-settings"
import { LandingPageBody, LandingPageHeader, LandingPageWrapper, LandingPageContent, LandingPageH1, LandingPageLogo } from "../../../_ui/page-landing"
import StatusMessage from "@/components/status-message"

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
			<LandingPageHeader>
				{logo &&
					<LandingPageLogo
						src={`${directusURL}/assets/${logo.filename_disk}`}
						alt={logo.description || ""}
						width={logo.width || "320"}
						height={logo.height || "240"}
					/>
				}
				{!logo &&
					<LandingPageH1
						className={clsx(
							!!banner && [
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
				}
			</LandingPageHeader>
			<StatusMessage
				className={clsx(
					"mb-0",
					"max-w-prose",
					"mx-auto",
				)} />
			<LandingPageBody>
				<LandingPageContent content={content} />
			</LandingPageBody>
		</LandingPageWrapper>
	</>
}

