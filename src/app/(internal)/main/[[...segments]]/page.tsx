import { getSettings } from "@/lib/directus/get-settings"
import { notFound } from "next/navigation"

export default async function MainPage({
	params
}: {
	params: Promise<{ segments?: string }>
}) {
	const settings = await getSettings()
	const routingMode = settings.routing_mode

	// switch (routingMode) {
	// case "single/single":
	return <>hello world</>

	// }

	notFound()
}