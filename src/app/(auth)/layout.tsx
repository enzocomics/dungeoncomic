"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
import { NextIntlClientProvider } from "next-intl"
import { ToastContainer } from "react-toastify"

export default async function AuthRootLayoutUI(props: LayoutProps<"/">) {
	return <html lang="en">
		<body
			className={clsx(
			)}
		>
			<NextIntlClientProvider>
				{props.children}
				<ToastContainer />
			</NextIntlClientProvider>
		</body>
	</html>
}