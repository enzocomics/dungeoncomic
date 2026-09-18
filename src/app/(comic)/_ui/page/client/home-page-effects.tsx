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

export default function ClientHomePageEffects() {
	// STATUS MESSAGE
	const setStatus = useChangeStatus("")
	// I18N
	const s = useTranslations("status-messages")
	const t = useTranslations("HomePage")
	// Get the url search param
	const params = useSearchParams()
	const urlStatus = params.get("status")
	// Get the user session

	// Display the status notification
	useEffect(() => {
		switch (urlStatus) {
			case "logged-out":
				setStatus("info", s("logged-out"))
				break
		}
	}, [urlStatus])

	return <></>
}