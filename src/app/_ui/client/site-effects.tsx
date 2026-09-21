"use client"
/**----------------------------------- */
// FUNCTIONS
import clsx from "clsx"
// LIBRARIES
import { useEffect, useLayoutEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
// I18N
import { useTranslations } from "next-intl"
// UI
import { useChangeStatus } from "@/components/status-message"
import { useGlobalContext } from "@/app/_context"

export default function ClientSiteEffects() {
	// STATUS MESSAGE
	const { statusMessage, setStatusMessage } = useGlobalContext()
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	const pathname = usePathname()
	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")

	// Display the status notification
	useLayoutEffect(() => {
		if (params.get("status") == "logged-out") {
			setStatus("info", `${params.get("status")}`)
		}
	}, [params])

	return <></>
}