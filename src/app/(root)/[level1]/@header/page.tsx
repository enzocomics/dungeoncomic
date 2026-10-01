import { getSettings } from "@/lib/directus/get-settings"
import ParallelLandingPageHeader from "@/ui/comic/components/@header/page"

export default async function Level1ParallelHeader({
	params
}: {
	params: Promise<{ level1: string }>
}) {
	const { level1 } = await params
	const settings = await getSettings()
	const routingMode = settings.routing_mode
	// switch (routingMode) {
	// 	case "single/single":
	// 		return null
	// 	case "single/multiple":
	// 		// Comic Landing Page
	// 		return <ParallelLandingPageHeader slug={level1} />
	// 	case "multiple/multiple":
	// 		return null
	// }
	return <>
		level 1 &raquo; parallel header
	</>
}