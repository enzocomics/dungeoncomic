import { NotFoundUI } from "@/ui/platform/not-found"
import { Suspense } from "react"

export default function NotFound() {
	return <Suspense>
		<NotFoundUI />
	</Suspense>

}