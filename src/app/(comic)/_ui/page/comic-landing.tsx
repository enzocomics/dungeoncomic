"use client"
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { LandingPageBody, LandingPageContent, LandingPageH1, LandingPageHeader, LandingPageWrapper } from "../../../_ui/page-landing"
import { ClientComicPageLandingButton } from "./client/comic-page-landing-button"
import { useTranslations } from "next-intl"
import { sanitize } from "@/lib/sanitize"
import StatusMessage from "@/components/status-message"

/**-----------------------------------
 * Comic Landing Page UI
 * ---
 */
export default function ComicLandingPageUI({
	comic,
	session,
	variables,
	userVariables,
	content,
}: {
	comic: Awaited<ReturnType<typeof getComic>>
	session?: Awaited<ReturnType<typeof verifySession>>
	variables: Awaited<ReturnType<typeof getComicVariables>>
	userVariables?: Record<string, string>
	content: string
}) {
	const t = useTranslations("ComicProject")
	// PRIMARY VARS
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo
	const startButtonText = comic.start_button_text ? sanitize(comic.start_button_text) : t("start-button-text")

	return <>
		{/* COMIC PAGE - CONTENT WRAPPER */}
		<LandingPageWrapper>
			<LandingPageBody>
				<LandingPageContent content={content} />
				{comic.pages_count > 0 &&
					<ClientComicPageLandingButton>
						{startButtonText} &raquo;
					</ClientComicPageLandingButton>
				}
			</LandingPageBody>
		</LandingPageWrapper >
	</>
}

