/**----------------------------------- */
// LIBRARIES
import { useTranslations } from 'next-intl'

/**----------------------------------- */
export default function Page() {
	const t = useTranslations("HomePage")
	return <h1 className="text-3xl">{t("title")}</h1>
}