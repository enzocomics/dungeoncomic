/**----------------------------------- */
// I18N
import { useTranslations } from "next-intl"

/**-----------------------------------
 * HOMEPAGE - UI
 */
export default function HomepageUI() {

	const t = useTranslations("HomePage")
	return <>
		<h1 className="text-3xl">{t("title")}</h1>
	</>
}