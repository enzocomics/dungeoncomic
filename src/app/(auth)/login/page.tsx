/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import LoginPageUI from "./_ui"

/**----------------------------------- */
export default function LoginPage() {
	return <LoginPageUI />
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("auth")
	return {
		title: t("pages.login.title"),
	}
}