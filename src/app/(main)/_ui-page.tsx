"use client"
/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import { ComponentPropsWithoutRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
// UI
import { useChangeStatus } from "@/components/status-message"
import clsx from "clsx"
import Image from "next/image"
import { Link } from "@/components/link"
import { StackedLayout } from "@/components/stacked-layout"

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
			Main Root Layout<br />
			Navigation:&nbsp;&nbsp;
			<Link href="/">Project Homepage</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic">Comic Landing Page</Link>&nbsp;&mdash;&nbsp;
			<Link href="/dungeoncomic/1">Comic Page 1</Link>
			<hr />
		</div>
		<h1 className="text-3xl">{t("title")}</h1>
		{children}
	</>
}
