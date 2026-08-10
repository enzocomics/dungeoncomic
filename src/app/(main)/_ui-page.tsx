"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
// UI
import { useChangeStatus } from "@/components/status-message"
import clsx from "clsx"
import { Link } from "@/components/link"


/**-----------------------------------
 * HOMEPAGE - UI
 */
export default function HomepagePageUI({ children }: { children: React.ReactNode }) {
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
		<div>
			{children}
		</div>
	</>
}
