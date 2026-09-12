"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// UI
import { useChangeStatus } from "@/components/status-message"
import NavMenu from "./nav-menu"
/**-----------------------------------
 * HOMEPAGE PAGE UI
 * ---
 */
export function HomepagePageUI() {
	// STATUS MESSAGE
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")

	// Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "logged-out":
				setStatus("info", s("logged-out"))
				break
		}
	}, [urlStatus])


	return <>
		<div className={clsx(
			"relative",
			"font-platform-copy",
			"bg-top",
			"bg-repeat-x",
			"bg-fixed",
		)}>
			<div
				style={{
					// backgroundImage: `url(${directusURL}/assets/${comic.banner?.filename_disk})`,
					backgroundImage: `url(img/backdrop.webp)`,
				}}
				className={clsx(
					// Position
					"-z-1",
					"fixed",
					"left-1/2 -translate-x-1/2 ",
					// Size
					"w-full",
					"max-w-[1600px]",
					"h-150",
					// Appearance
					"opacity-75",
					// Background
					"bg-cover",
					"bg-top",
					"bg-fixed",
					"bg-blend-saturation",
					// Background: Fade to bottom
					"mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)",
					"[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%)]",
					// Background: Fade to left & right (desktop)
					"xl:mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)",
					"xl:mask-composite:intersect",
					"xl:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_50%,transparent_100%),linear-gradient(to_right,transparent_0%,black_5%,black_95%,transparent_100%)]",
					"xl:[-webkit-mask-composite:source-in]",
				)} />
			<NavMenu menu={false} />
			<main className={clsx(
				"mx-auto",
				"max-w-6xl",
				"md:px-6",
			)}>
				This is the homepage
			</main>
		</div>
	</>
}