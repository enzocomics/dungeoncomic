import { getSettings } from "./directus/get-settings"

export function resolveRoute(
	pathname: string,
	routingMode: Awaited<ReturnType<typeof getSettings>>["routing_mode"],
): string | null {
	// Get the segments divided by /
	const segments = pathname.split("/").filter(Boolean)

	switch (routingMode) {
		case "single/single":
			// const [pagenum] = segments
			return "/---"
		// return null
		case "single/multiple":
			const [title, page] = segments
			return `/main/${title}`
		case "multiple/multiple":
		default:
			return null
	}
}
