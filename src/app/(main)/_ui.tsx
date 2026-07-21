"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
// CMS
import { toastOptions } from "@/lib/toastify/toast"

/**-----------------------------------
 * HOMEPAGE - UI
 */
export default function HomepageUI() {
	// I18N
	const n = useTranslations("Notifications")
	const t = useTranslations("HomePage")
	// Get the url search param
	const urlStatusParam = useSearchParams()
	const urlStatus = urlStatusParam.get("status")

	// Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "logged-out":
				toast.success(n("logged-out"), toastOptions)
				break
		}
	}, [urlStatus])

	return <>
		<h1 className="text-3xl">{t("title")}</h1>
	</>
}