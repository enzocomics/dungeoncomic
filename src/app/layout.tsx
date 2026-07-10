/**----------------------------------- */
// STYLES 
import "@/styles/globals.css"

// FUNCTIONS
import clsx from "clsx"
// I18N
import { NextIntlClientProvider } from "next-intl"

/**-----------------------------------
 * Root Layout. Wraps the entire site.
 * 
 */
export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={clsx(
					"",
				)}
			>
				<NextIntlClientProvider>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>

	)
}