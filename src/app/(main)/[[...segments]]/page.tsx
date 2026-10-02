import { getSettings } from "@/lib/directus/get-settings"
import { resolveRoute } from "@/lib/resolver"
import { notFound } from "next/navigation"

export default async function MainPage({
	params
}: {
	params: Promise<{ segments?: string[] }>
}) {
	const { segments = [] } = await params
	const settings = await getSettings()

	const route = resolveRoute(
		segments,
		settings.routing_mode
	)

	if (!route) notFound()

	switch (route.type) {
		case "main":
			return <>Main Content</>
	}

}