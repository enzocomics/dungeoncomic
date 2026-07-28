"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "react-toastify"

export default async function DashboardRootLayoutUI(props: LayoutProps<"/">) {
	return <html lang="en" suppressHydrationWarning>
		<body
			className={clsx(
			)}
		>
			<ThemeProvider>
				<NextIntlClientProvider>
					{props.children}
					<ToastContainer />
				</NextIntlClientProvider>
			</ThemeProvider>
		</body>
	</html>
}