"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// UI
import { useChangeStatus } from "@/components/status-message"
import { useGlobalContext } from "@/app/_context"

export default function ClientHomePageEffects() {
	// STATUS MESSAGE
	const { statusMessage } = useGlobalContext()
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")

	// Display the status notification
	useEffect(() => {
		console.log(params, urlStatus)
		if (params.get("status") == "logged-out") {
			setStatus("info", `${params.get("status")}`)
		}
		// switch (urlStatus) {
		// 	case "logged-out":
		// 		setStatus("info", s("logged-out"))
		// 		break
		// }
		console.log('hi')
	}, [params])

	// useEffect(() => {
	// 	if (params.get("status") == "logged-out") {
	// 		setStatus("info", `${params.get("status")}`)
	// 	}
	// }, [params])


	return <></>
}