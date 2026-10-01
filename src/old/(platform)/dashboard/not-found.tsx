import { NotFoundUI } from "@/app/_ui/not-found"
import { PlatformMainContent } from "@/ui/platform/components/main"

export default function NotFound() {
	return <>
		<PlatformMainContent>
			<NotFoundUI />
		</PlatformMainContent>
	</>
}