import { getSettings } from "@/lib/directus/get-settings"
import { resolveRoute } from "@/ui/platform/functions/resolver"
import { notFound } from "next/navigation"

export default async function MainPage({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	const { segments = [] } = await params
	const settings = await getSettings()

	const route = await resolveRoute(
		segments,
		settings.routing_mode
	)

	if (!route) notFound()

	switch (route.type) {
		case "comic-landing-page":
			return <>
				{route.type}
			</>
		case "comic-action":
			return <>
				{route.type}
			</>
		case "comic-single-page":
			return <>
				{route.type}
			</>
		case "comic-single-page-action":
			return <>
				{route.type}
			</>
	}

}