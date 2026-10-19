import { verifySession } from "@/data/session"
import { getSettings } from "@/lib/directus/get-settings"
import ThemePageUI from "@/ui/dashboard/pages/theme"
import { notFound } from "next/navigation"
import { connection } from "next/server"

export const instant = false
export default async function Page() {
	await connection()
	const settings = await getSettings()
	const session = await verifySession()
	const userCanUpdateSettings = session?.permissions?.settings?.update?.access === "full"
	if (userCanUpdateSettings)
		return <ThemePageUI settings={settings} />
	else
		notFound()
}