"use server"
/**----------------------------------- */
import "@/styles/globals.css"
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { NextIntlClientProvider } from "next-intl"
import { ToastContainer } from "react-toastify"

/**-----------------------------------
 * ROOT LAYOUT - MAIN APP
 */
export default async function MainRootLayoutUI(props: LayoutProps<"/">) {
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