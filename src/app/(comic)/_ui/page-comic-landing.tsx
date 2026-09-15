"use client"
import { useChangeStatus } from "@/components/status-message"
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic } from "@/lib/directus/get-comics"
import clsx from "clsx"
import { useTranslations } from "next-intl"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"

/**-----------------------------------
 * Comic Landing Page UI
 * ---
 */
export default function ComicLandingPageUI({
	comic,
	session
}: {
	comic: Awaited<ReturnType<typeof getComic>>
	session?: Awaited<ReturnType<typeof verifySession>>
}) {
	// HOOKS
	const pathname = usePathname()
	const path = pathname.endsWith("/") ? pathname : `${pathname}/`

	const searchParams = useSearchParams()
	const t = useTranslations("ComicPage")
	const setStatus = useChangeStatus("")
	// PRIMARY VARS
	const hasBanner = !!comic.banner

	return <>
		{/* COMIC PAGE - CONTENT WRAPPER */}
		<div
			className={clsx(
				"relative",

			)
			}
		>
			<header
				className={clsx(
					"flex",
					"items-center",
					"justify-center",
					"py-20",
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
							"max-h-60"
						)}
					/>
				}
			</header>
			{/* COMIC PAGE - CONTENT BODY */}
			<article
				className={clsx(
					// TEmp
					"h-400",
					// Structure
					"flex",
					"flex-col",
					"gap-6",
					// Spacing
					"pt-6",
					"pb-18",
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
				<Link href={`${path}1`}>Go to first page</Link>
			</article>
		</div>
	</>
}