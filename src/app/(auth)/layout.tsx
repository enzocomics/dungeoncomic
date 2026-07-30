"use server"
/**----------------------------------- */
import "@/styles/globals.css"
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
			// Default Colours
			"text-base-content",
			"bg-secondary-200",
			"dark:bg-secondary-700"
		)}
	>
		<body
			className={clsx(
				"h-full",
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