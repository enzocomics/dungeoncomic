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
		<div
			className={clsx(
				"relative",
			)}
		>
			<header
				className={clsx(
					"flex",
					"items-center",
					"justify-center",
				)}
			>

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
			</header>
			{/* COMIC PAGE - CONTENT BODY */}
			<article
				className={clsx(

					// Structure
					"flex",
					"flex-col",
					"gap-6",
					// Spacing
					"pt-6",
					"pb-18",
					"sm:pt-12",
					"lg:pt-18",
					// Appearance
					"bg-base-1",
					"dark:bg-base-2",
					"dark:shadow-none",
					"dark:outline",
					"dark:-outline-offset-1",
					"dark:outline-base-5/50",
					"text-center",
					"md:rounded-t",
				)}
			>
				<div dangerouslySetInnerHTML={{
					__html: content
					,
				}}
					className={clsx(
						"landing-page-content",
						// "py-6",
						"prose",
						"text-base/loose",
						"lg:text-lg/loose",
						"text-left",
						"text-pretty",
					)}
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
			</article>
		</div>
	</>
}