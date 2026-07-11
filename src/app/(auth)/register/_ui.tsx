"use client"
/**----------------------------------- */
// LIBRARIES
import { useTranslations } from "next-intl"

/**----------------------------------- */
export default function RegisterPageUI() {
	// I18N
	const t = useTranslations("Register")

	// EXPORT
	return <>
		<h1 className="text-3xl">{t("title")}</h1>

	</>

}