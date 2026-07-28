"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"

export default async function ErrorRootLayoutUI(props: LayoutProps<"/[...not-found]">) {
	return <html lang="en" suppressHydrationWarning>
		<body
			className={clsx(
			)}
		>
			<ThemeProvider>
				<NextIntlClientProvider>
					{props.children}
				</NextIntlClientProvider>
			</ThemeProvider>
		</body>
	</html>
}