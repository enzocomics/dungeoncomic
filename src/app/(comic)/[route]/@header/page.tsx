
import { directusURL } from "@/data/env"
import { verifySession } from "@/data/session"
import { getComic, getComicVariables } from "@/lib/directus/get-comics"
import clsx from "clsx"

import { useTranslations } from "next-intl"
import { sanitize } from "@/lib/sanitize"
import StatusMessage from "@/components/status-message"
import { LandingPageH1, LandingPageHeader, LandingPageLogo } from "@/app/_ui/page-landing"
import PageEffects from "./_effects"
import ClientLandingPageHeader from "./_effects"
import { getSettings } from "@/lib/directus/get-settings"


export default async function Page({
	params
}: {
	params: Promise<{ route: string }>
}) {
	const { route } = await params
	const comic = await getComic({ slug: route })
	const settings = await getSettings()
	const hasLogo = !!comic.logo
	const hasBanner = !!comic.banner
	return <>
		<ClientLandingPageHeader comic={comic} settings={settings} />
	</>
}