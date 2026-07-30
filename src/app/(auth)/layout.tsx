"use server"
/**----------------------------------- */
import "@/styles/globals.css"
import { copy, display } from "@/styles/fonts"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
// UI
import GlobalContextProvider from "../(main)/_context"
import { AuthLayout } from "@/app/(auth)/_ui"

/**-----------------------------------
 * AUTH - ROOT LAYOUT
 */
export default async function AuthRootLayoutUI(props: LayoutProps<"/">) {
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
						<AuthLayout>
							{props.children}
						</AuthLayout>
					</NextIntlClientProvider>
				</ThemeProvider>
			</GlobalContextProvider>
		</body>
	</html>
}