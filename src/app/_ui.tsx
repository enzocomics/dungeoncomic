/**----------------------------------- */
import "@/styles/globals.css"
import { copy, display } from "@/styles/fonts"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { Metadata, Viewport } from "next"
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "@teispace/next-themes"
// UI
import GlobalContextProvider from "./_context"

export default async function RootLayoutUI({
	children
}: {
	children: React.ReactNode | null
}) {
	return <html lang="en" suppressHydrationWarning
		className={clsx(
			"h-full",
			`${copy.variable}`,
			`${display.variable}`,
			// Default Colours
			"text-base-content",
			"bg-secondary-200",
			"dark:bg-secondary-700"
		)}
	>
		<body
			className={clsx(
				"h-full",
				"font-copy",
			)}
		>
			<GlobalContextProvider>
				<ThemeProvider>
					<NextIntlClientProvider>
						{children}
					</NextIntlClientProvider>
				</ThemeProvider>
			</GlobalContextProvider>
		</body>
	</html>
}