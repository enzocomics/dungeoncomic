"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
// UI
import { useChangeStatus } from "@/components/status-message"
import { useGlobalContext } from "./_context"

/**-----------------------------------
 * HOMEPAGE - UI
 */
export default function HomepageUI() {
	// STATUS MESSAGE
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	// Get the url search param
	const urlStatusParam = useSearchParams()
	const urlStatus = urlStatusParam.get("status")

	// Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "logged-out":
				setStatus(s("logged-out"), "success")
				break
		}
	}, [urlStatus])


	return <>
		<h1 className="text-3xl">{t("title")}</h1>
	</>
}