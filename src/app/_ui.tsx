/**----------------------------------- */
import "@/styles/globals.css"
import { fonts } from "@/styles/fonts"
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
			Object.values(fonts).map((f) => f.font.variable),
			// Default Colours
			"text-base-content",

		)}
	>
		<body
			className={clsx(
				"min-w-xs",
				"h-full",
				"font-copy",
				"relative",
				"bg-fixed",
				"bg-neutral-600",
				"dark:bg-neutral-800",
				// "dark:bg-yellow-800/50"
			)}
			style={{
				// https://heropatterns.com/
				backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='currentColor' fill-opacity='0.15'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
			}}
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