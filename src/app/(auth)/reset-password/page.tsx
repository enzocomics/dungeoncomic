/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
import ResetPasswordPageUI from "./_ui"

/**----------------------------------- */
export default function ResetPasswordPage() {
	const t = useTranslations("auth")
	return <ResetPasswordPageUI />
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("auth")
	return {
		title: t("pages.reset-password.title"),
	}
}