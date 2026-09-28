/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"
/**-----------------------------------
 * Dasboard Page UI
 */
export default function DashboardPageUI() {
	const t = useTranslations("auth")
	return <>
		<h1 className="font-platform-display text-3xl">{t("pages.dashboard.title")}</h1>
		asdf
	</>
}