"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"

export default async function ErrorRootLayoutUI(props: LayoutProps<"/[...not-found]">) {
	return <html lang="en">
		<body
			className={clsx(
			)}
		>
			<NextIntlClientProvider>
				{props.children}
			</NextIntlClientProvider>
		</body>
	</html>
}