"use server"
/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
// UI
import RegisterPageUI from "./_ui"

/**----------------------------------- */
export default async function RegisterPage() {
	return <RegisterPageUI />
}
/** ------------------------------------------------ **
 * Page Metadata
 * - Will override the global site metadata
 * - Can use the same page parameters
 ** ------------------------------------------------ **/
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("auth")
	return {
		title: t("pages.register.title"),
	}
}