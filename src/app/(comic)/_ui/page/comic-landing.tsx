"use client"
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { LandingPageBody, LandingPageContent, LandingPageH1, LandingPageHeader, LandingPageLogo, LandingPageWrapper } from "./components"
import { ClientComicPageLandingButton } from "./client/comic-page-landing-button"

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
	// PRIMARY VARS
	const hasBanner = !!comic.banner
	const hasLogo = !!comic.logo

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
			<LandingPageBody>
				<LandingPageContent content={content} />
				{comic.pages_count > 0 &&
					<ClientComicPageLandingButton>
						Start Reading &raquo;
					</ClientComicPageLandingButton>
				}
			</LandingPageBody>
		</LandingPageWrapper >
	</>
}

