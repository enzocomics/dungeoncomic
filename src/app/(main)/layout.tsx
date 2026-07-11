/**----------------------------------- */
// STYLES 
import "@/styles/globals.css"

// FUNCTIONS
import clsx from "clsx"
// I18N
import { NextIntlClientProvider } from "next-intl"

/**-----------------------------------
 * ROOT LAYOUT - MAIN SITE
 * 
 */
export default async function MainRootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body
				className={clsx(
					"bg-neutral-700",
					"text-white"
				)}
			>
				<NextIntlClientProvider>
					{children}
				</NextIntlClientProvider>
			</body>
		</html>

	)
}