"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "react-toastify"
// UI
import GlobalContextProvider from "./_context"
import StatusMessage from "@/components/status-message"

/**-----------------------------------
 * ROOT LAYOUT - MAIN APP
 */
export default async function MainRootLayoutUI(props: LayoutProps<"/">) {
	return <html lang="en" suppressHydrationWarning>
		<body
			className={clsx(
			)}
		>
			<GlobalContextProvider>
				<ThemeProvider>
					<NextIntlClientProvider>
						<StatusMessage />
						{props.children}
						<ToastContainer />
					</NextIntlClientProvider>
				</ThemeProvider>
			</GlobalContextProvider>
		</body>
	</html>
}