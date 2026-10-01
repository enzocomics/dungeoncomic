import ParallelHeaderUI from "@/ui/comic/components/@header/page";
import { getSettings } from "@/lib/directus/get-settings";

export default async function Level2ParallelHeader({
	params
}: {
	params: Promise<{ level1: string, level2: string }>
}) {

	const { level1, level2 } = await params
	const settings = await getSettings()

	const routingMode = settings.routing_mode

	switch (routingMode) {
		case "single/single":
		case "single/multiple":
			return null
		case "multiple/multiple":
			if (settings.post_type_name_slug == level1)
				return <>
					<ParallelHeaderUI slug={level2} />
				</>
	}
}