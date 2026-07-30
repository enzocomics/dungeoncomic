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

export default async function AuthRootLayoutUI(props: LayoutProps<"/">) {
	return <html lang="en" suppressHydrationWarning
		className={clsx(
			"h-full",
			"bg-gray-50 dark:bg-gray-900"
		)}
	>
		<body
			className={clsx(
				"h-full"
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