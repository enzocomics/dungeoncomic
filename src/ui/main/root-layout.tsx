"use server"
/**----------------------------------- */

import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"

export default async function MainRootLayoutUI({
	children
}: {
	children: React.ReactNode
}) {
	return <html lang="en">
		<body
			className={clsx(
				"bg-neutral-700",
				"text-white"
			)}
		>
			<NextIntlClientProvider>
				{children}
			</NextIntlClientProvider>
		</body>
	</html>
}