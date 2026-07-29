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
import { useChangeStatus } from "@/components/status-message"
import { useGlobalContext } from "./_context"

/**-----------------------------------
 * HOMEPAGE - UI
 */
export default function HomepageUI() {
	const { statusMessage, setStatusMessage } = useGlobalContext()
	const changeStatus = useChangeStatus()
	// I18N
	const n = useTranslations("notifications")
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
		<button onClick={() => { changeStatus("hello") }}>ChangeStatus</button>
	</>
}