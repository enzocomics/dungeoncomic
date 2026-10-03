import { NotFoundUI } from "@/ui/platform/not-found"
import { PlatformMainArticle } from "@/ui/platform/components/main"
import { Suspense } from "react"

export default function NotFound() {
	return <Suspense>
		<NotFoundUI />
	</Suspense>

}