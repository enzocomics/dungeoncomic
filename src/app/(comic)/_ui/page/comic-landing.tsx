"use client"
import { Button, Field, } from "@headlessui/react"
import { marked } from "marked"
import { sanitize } from "@/lib/sanitize"
import { useChangeStatus } from "@/components/status-message"
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { replaceComicVariables } from "../../_functions/parse-content"
import { ComicButton } from "@/components/button"
import { LandingPageBody, LandingPageContent, LandingPageH1, LandingPageHeader, LandingPageLogo, LandingPageWrapper } from "./components"

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
	// HOOKS
	const pathname = usePathname()
	const path = pathname.endsWith("/") ? pathname : `${pathname}/`

	const searchParams = useSearchParams()
	const t = useTranslations("ComicPage")
	const setStatus = useChangeStatus("")
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
			{/* COMIC PAGE - CONTENT BODY */}
			<LandingPageBody>
				<LandingPageContent
					content={content}
				/>
				<div className={clsx(
					"px-6",
					"mx-auto",
					"w-full",
					"max-w-2xl"
				)}>
					{comic.pages_count > 0 &&
						<ComicButton as="link" href={`${path}1`}>
							Start Reading &raquo;
						</ComicButton>
					}
				</div>
			</LandingPageBody>
		</LandingPageWrapper>
	</>
}

