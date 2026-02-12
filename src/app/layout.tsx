/**----------------------------------- */
// STYLES 
import "@/styles/globals.css"

// FUNCTIONS
import clsx from "clsx"

/**-----------------------------------
 * Root Layout. Wraps the entire site.
 * 
 */
export default function RootLayout({
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
				{children}
			</body>
		</html>

	)
}