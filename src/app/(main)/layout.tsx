"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"

export default async function MainRootLayoutUI(props: LayoutProps<"/">) {
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