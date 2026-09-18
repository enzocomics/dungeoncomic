"use client"
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { LandingPageBody, LandingPageContent, LandingPageH1, LandingPageHeader, LandingPageLogo, LandingPageWrapper } from "../../../_ui/page-landing"
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
	const startButtonText = sanitize(`${comic.start_button_text}`) || t("start-button-text")

	return <>
		{/* COMIC PAGE - CONTENT WRAPPER */}
		<LandingPageWrapper>
			<LandingPageHeader>
				{comic.logo &&
					<LandingPageLogo
						src={`${directusURL}/assets/${comic.logo.filename_disk}`}
						alt={comic.logo.description || ""}
						width={comic.logo.width || "320"}
						height={comic.logo.height || "240"}
					/>
				}
				{!hasLogo &&
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
						{comic.title}
					</LandingPageH1>
				}
			</LandingPageHeader>
			<StatusMessage
				className={clsx(
					"mb-2",
					"max-w-prose",
					"mx-auto",
				)} />
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

