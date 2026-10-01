import { NotFoundUI } from "@/ui/platform/not-found"
import { PlatformMainArticle } from "@/ui/platform/components/main"

export default function NotFound() {
	return <>
		<PlatformMainArticle>
			<NotFoundUI />
		</PlatformMainArticle>
	</>
}