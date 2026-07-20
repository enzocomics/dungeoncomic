import { useTranslations } from "next-intl"
import Link from "next/link"
import { logout } from "../logout/_action"

export default function DashboardPageUI() {
	const t = useTranslations("auth")
	return <>
		<h1 className="text-3xl">{t("pages.dashboard.title")}</h1>

		<Link href="/logout">Logout</Link>

	</>
}