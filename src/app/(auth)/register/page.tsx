"use server"
/**----------------------------------- */
// LIBRARIES
import { Suspense } from "react"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
// CMS
import { readSettings } from "@directus/sdk"
// COMPONENTS
import { verifySession } from "@/data/session"
import RegisterPageUI from "./_ui"
import { adminClient } from "@/lib/directus/clients"

/**-----------------------------------
 * REGISTER PAGE ROUTE
 */
export default async function RegisterPage() {
	// Check if public registration is open
	const { public_registration } = await adminClient.request(readSettings({
		fields: ["public_registration"]
	}))
	// Check if the user session exists
	const user = await verifySession()
	// Show the create account UI if the user is not logged in
	if (!user) return <Suspense>
		<RegisterPageUI public_registration={public_registration} />
	</Suspense>
	// Otherwise, redirect them to the dahsboard
	else redirect("/dashboard")
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