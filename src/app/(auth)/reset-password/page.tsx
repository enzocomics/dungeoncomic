/**----------------------------------- */
// LIBRARIES
import { Metadata } from "next"
import { Suspense } from "react"
// I18N
import { useTranslations } from "next-intl"
import { getTranslations } from "next-intl/server"
// UI
import ResetPasswordPageUI from "./_ui"

/**----------------------------------- */
export default function ResetPasswordPage() {
	// I18N
	const t = useTranslations("auth")
	// OUTPUT
	// - The suspense boundary is required because we call useSearchParams() in the UI
	return <Suspense>
		<ResetPasswordPageUI />
	</Suspense>
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