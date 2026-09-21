
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"

import { useTranslations } from "next-intl"
import { sanitize } from "@/lib/sanitize"
import StatusMessage from "@/components/status-message"
import { LandingPageH1, LandingPageHeader, LandingPageLogo } from "@/app/_ui/page-landing"

export default async function Page({
	params
}: {
	params: Promise<{ route: string }>
}) {
	const { route } = await params
	const comic = await getComic({ slug: route })
	const hasLogo = !!comic.logo
	const hasBanner = !!comic.banner
	return <>
		<LandingPageHeader className={clsx(
		)}>
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
	</>
}