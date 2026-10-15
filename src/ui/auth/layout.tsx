import { AuthLayout } from "@/app/(auth)/_ui"
import StatusMessage from "@/components/status-message"
import { Suspense } from "react"

export default async function AuthRootLayoutUI({
	children
}: {
	children: React.ReactNode
}) {
	return <>
		<Suspense>
			<StatusMessage />
		</Suspense>
		<Suspense>
			<AuthLayout>
				{children}
			</AuthLayout>
		</Suspense>
	</>
}