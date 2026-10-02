import { getSettings } from "@/lib/directus/get-settings"

export function resolveRoute(
	segments: string[],
	routingMode: Awaited<ReturnType<typeof getSettings>>["routing_mode"],
) {
	switch (routingMode) {
		case "single/single":
			// const [pagenum] = segments
			return {
				type: "main",
			}
		// return null
		case "single/multiple":
		// const [title, page] = segments
		// return `/main/${title}`
		case "multiple/multiple":
		default:
			return null
	}
}
