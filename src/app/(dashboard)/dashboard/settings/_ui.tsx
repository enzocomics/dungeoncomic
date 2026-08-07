/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
// LIBRARIES
import Link from "next/link"

/**-----------------------------------
 * Dasboard Page UI
 */
export default function DashboardSettingsPageUI() {
	const t = useTranslations("auth")
	return <>
		<h1 className="text-3xl">Settings</h1>
		<Link href="/logout">Logout</Link>
	</>
}