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
import { LandingPageBody, LandingPageContent, LandingPageHeader, LandingPageWrapper } from "./components"

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
					<Image
						src={`${directusURL}/assets/${comic.logo.filename_disk}`}
						alt={comic.logo.description || ""}
						width={comic.logo.width || "320"}
						height={comic.logo.height || "240"}
						className={clsx(
							"drop-shadow-black/50",
							"drop-shadow-lg",
							"max-h-60",
							"my-20",
							"box-content",
						)}
					/>
				}
				{!hasLogo &&
					<h1 className={clsx(
						"flex",
						"items-center",
						"min-h-48",
						"px-6",
						"py-6",
						"font-comic-display",
						"text-5xl/tight",
						"text-center",
						"text-pretty",
						"font-bold",
						"max-w-2xl",
						"rounded",
						hasBanner ? [
							"text-white",
							"[text-stroke:16px_black",
							"[-webkit-text-stroke:16px_black]",
							"[paint-order:stroke_fill]",
							"drop-shadow-black/50",
							"drop-shadow-md",
						] : [],

						// Appearance
						// "bg-black/80",
						// "text-white",
						// "bg-base-1/80",
						// "dark:bg-base-2/80",
						// "backdrop-blur-xs",
					)}>
						{comic.title}
					</h1>
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

