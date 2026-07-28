"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
// UI
import GlobalContextProvider from "@/app/(main)/_context"

export default async function ErrorRootLayoutUI(props: LayoutProps<"/[...not-found]">) {
	return <html lang="en" suppressHydrationWarning>
		<body
			className={clsx(
			)}
		>
			<GlobalContextProvider>
				<ThemeProvider>
					<NextIntlClientProvider>
						{props.children}
					</NextIntlClientProvider>
				</ThemeProvider>
			</GlobalContextProvider>
		</body>
	</html>
}